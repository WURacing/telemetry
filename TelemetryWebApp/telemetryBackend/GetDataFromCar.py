from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio.client import Redis
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
import asyncio
import struct
import os
import serial
import uvicorn
import socketio
import redis.asyncio as redis
import json
import logging

load_dotenv()

# ── Serial port ───────────────────────────────────────────────────────────────
# Set SERIAL_PORT in .env to match the port your Trimble receiver appears on.
# macOS example: /dev/tty.usbserial-0001
# Linux example: /dev/ttyUSB0  or  /dev/ttyS0
SERIAL_CONFIG = {
    'PORT':      os.environ.get('SERIAL_PORT', '/dev/tty.usbserial-0001'),
    'BAUD_RATE': 19200,   # must match Trimble serial port setting
    'TIMEOUT':   0.5,     # seconds — long enough to receive a full 43-byte packet
}

# ── Redis ─────────────────────────────────────────────────────────────────────
REDIS_HOST     = os.environ.get("REDIS_HOST")
REDIS_PORT     = int(os.environ.get("REDIS_PORT"))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

# ── Binary packet constants ───────────────────────────────────────────────────
PACKET_DATA_LEN = 40          # 5 frames × 8 bytes
NUM_CHANNELS    = 20          # 5 frames × 4 int16 signals each

# Scale factors applied to each raw int16 channel before publishing.
# Indices match the FRAME_IDS order in Telemetry_Sender.ino:
#   [0]  ShockPotFL  (mm,   ×0.1)    [1]  ShockPotFR  (mm,   ×0.1)
#   [2]  ShockPotRL  (mm,   ×0.1)    [3]  ShockPotRR  (mm,   ×0.1)
#   [4]  SteeringPot (deg,  ×0.1)    [5]  BrkPrsF     (psi,  ×0.1)
#   [6]  BrkPrsR     (psi,  ×0.1)    [7]  RPM         (rpm,  ×1.0)
#   [8]  TPS         (%,    ×0.01)   [9]  MAP         (kPa,  ×0.1)
#   [10] CoolantTemp (°C,   ×0.1)    [11] OilPressure (psi,  ×0.1)
#   [12] OilTemp     (°C,   ×0.1)    [13] FuelPressure(psi,  ×0.1)
#   [14] Lambda      (λ,    ×0.001)  [15] Gear        (gear, ×1.0)
#   [16] MAT         (°C,   ×0.1)    [17] GPS_Speed   (km/h, ×0.1)
#   [18] GPS_X       (m,    ×0.1)    [19] GPS_Y       (m,    ×0.1)
CHANNEL_FACTORS = [
    0.1,   0.1,   0.1,   0.1,   # ShockPotFL, FR, RL, RR
    0.1,   0.1,   0.1,   1.0,   # SteeringPot, BrkPrsF, BrkPrsR, RPM
    0.01,  0.1,   0.1,   0.1,   # TPS, MAP, CoolantTemp, OilPressure
    0.1,   0.1,   0.001, 1.0,   # OilTemp, FuelPressure, Lambda, Gear
    0.1,   0.1,   0.1,   0.1,   # MAT, GPS_Speed, GPS_X, GPS_Y
]
CHANNEL_OFFSETS = [0.0] * NUM_CHANNELS

# ── Globals ───────────────────────────────────────────────────────────────────
redis_client: Optional[Redis] = None
ser: Optional[serial.Serial]  = None
executor = ThreadPoolExecutor(max_workers=1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TelemetryData(BaseModel):
    timestamp: datetime
    session_name: str
    channels: list[float]


# ── Packet decoder ────────────────────────────────────────────────────────────

def _crc8(data: bytes) -> int:
    crc = 0
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = ((crc << 1) ^ 0x07) if crc & 0x80 else (crc << 1)
            crc &= 0xFF
    return crc


def read_packet(ser: serial.Serial) -> Optional[List[float]]:
    """
    Block until a valid 68-byte packet arrives on the serial port.
    Packet format: [0x55][0xAA][SEQ:1][DATA:32][CRC8:1]
    Returns 16 scaled float channel values, or None on error.
    """
    # Seek to sync bytes 0x55 0xAA
    prev = 0x00
    while True:
        b = ser.read(1)
        if not b:
            return None
        cur = b[0]
        if prev == 0x55 and cur == 0xAA:
            break
        prev = cur

    # Read seq(1) + data(64) + crc(1)
    rest = ser.read(1 + PACKET_DATA_LEN + 1)
    if len(rest) != 1 + PACKET_DATA_LEN + 1:
        return None

    data_bytes   = rest[1:1 + PACKET_DATA_LEN]
    received_crc = rest[-1]

    computed = _crc8(data_bytes)
    if computed != received_crc:
        logger.warning(f"CRC mismatch — got 0x{received_crc:02X}, expected 0x{computed:02X} — dropping packet")
        return None

    logger.info("Packet decoded OK")
    raw = struct.unpack_from('<20h', data_bytes)
    return [raw[i] * CHANNEL_FACTORS[i] + CHANNEL_OFFSETS[i] for i in range(NUM_CHANNELS)]


# ── Redis helper ──────────────────────────────────────────────────────────────

class SerialProcessor:
    def __init__(self):
        self.redis = redis_client
        self.current_session = "FSAE Telemetry"

    async def save_to_redis(self, channels: List[float]):
        timestamp = datetime.utcnow().isoformat()
        telemetry_data = {
            'timestamp':    timestamp,
            'session_name': self.current_session,
            'channels':     channels,
        }
        key = "telemetry_at_" + timestamp
        await self.redis.set(key, json.dumps(telemetry_data), ex=3600)
        await self.redis.publish("telemetry_channel", json.dumps(telemetry_data))
        return telemetry_data


# ── FastAPI / Socket.IO app ───────────────────────────────────────────────────

app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.ASGIApp(sio, app)


@app.on_event("startup")
async def start_serial_reading():
    global redis_client, ser

    redis_client = await redis.Redis(
        host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD
    )

    try:
        ser = serial.Serial(
            SERIAL_CONFIG['PORT'],
            SERIAL_CONFIG['BAUD_RATE'],
            timeout=SERIAL_CONFIG['TIMEOUT'],
        )
        logger.info(f"Serial port open: {SERIAL_CONFIG['PORT']} @ {SERIAL_CONFIG['BAUD_RATE']} baud")
    except serial.SerialException as e:
        logger.error(f"Failed to open serial port: {e}")
        return

    processor = SerialProcessor()
    processor.redis = redis_client
    asyncio.create_task(_serial_loop(processor))


CHANNEL_NAMES = [
    'ShockPotFL', 'ShockPotFR', 'ShockPotRL',  'ShockPotRR',
    'SteeringPot','BrkPrsF',    'BrkPrsR',      'RPM',
    'TPS',        'MAP',        'CoolantTemp',  'OilPressure',
    'OilTemp',    'FuelPressure','Lambda',       'Gear',
    'MAT',        'GPS_Speed',  'GPS_X',        'GPS_Y',
]

async def _serial_loop(processor: SerialProcessor):
    loop = asyncio.get_event_loop()
    logger.info("Serial loop started — waiting for packets")
    while True:
        channels = await loop.run_in_executor(executor, read_packet, ser)
        if channels:
            logger.info("  ".join(f"{CHANNEL_NAMES[i]}={channels[i]:.3f}" for i in range(NUM_CHANNELS)))
            try:
                await processor.save_to_redis(channels)
                logger.info("Published to Redis OK")
            except Exception as e:
                logger.error(f"Redis publish failed: {e}")


if __name__ == "__main__":
    uvicorn.run(sio_app, host="0.0.0.0", port=4500, log_level="info")
