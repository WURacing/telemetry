from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from redis.asyncio.client import Redis
from typing import List, Optional, Tuple
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
import asyncio
import time
import os
import serial
import uvicorn
import socketio
import redis.asyncio as redis
import json
import logging

# Configuration
load_dotenv()

SERIAL_CONFIG = {
    'PORT': '/dev/tty.usbmodem101',
    'BAUD_RATE': 115200,
    'TIMEOUT': 0.01
}

# Get Redis credentials from the OS
REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = int(os.environ.get("REDIS_PORT"))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

# Global variables for background tasks
serial_task: Optional[asyncio.Task] = None
redis_client: Optional[Redis] = Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
ser: Optional[serial] = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TelemetryData(BaseModel):
    timestamp: datetime
    session_name: str
    channels: list[float]


async def process_line(line: str) -> Optional[List[float]]:
    if "Shorts: " in line:
        try:
            data_str = line.split("Shorts: ")[1].strip()
            values = [float(x.strip()) for x in data_str.split(",") if x.strip()]
            return values[:36]
        except (ValueError, IndexError) as e:
            print(f"Error processing line: {e}")
            return None
    return None


class SerialProcessor:
    def __init__(self):
        self.redis = redis_client
        self.current_session = "FSAE Telemetry"

    async def save_to_redis(self, data: List[float]):
        # Look into using Redis Timeseries (redis.ts_get() or smth)
        timestamp = datetime.utcnow().isoformat()
        telemetry_name: str = "telemetry_at_" + str(timestamp)
        telemetry_data = {
            'timestamp': timestamp,
            'session_name': self.current_session,
            'channels': data
        }

        await (self.redis.set(telemetry_name, json.dumps(telemetry_data), ex=3600))
        await redis_client.publish("telemetry_channel", json.dumps(telemetry_data))

        return telemetry_data



""" 
@app.on_event("startup") will be deprecated in a future version. The commented code below will allow
us the same functionality. However, I'm pretty sure it doesn't work.
"""

# @asynccontextmanager
# async def lifespan():
#     logger.info("Starting serial reading...")
#     ser = serial.Serial(SERIAL_CONFIG['PORT'], SERIAL_CONFIG['BAUD_RATE'], timeout=SERIAL_CONFIG['TIMEOUT'])
#     processor = SerialProcessor()
#     await redis.Redis(host=REDIS_CONFIG['HOST'], port=REDIS_CONFIG['PORT'], password=REDIS_CONFIG['PASSWORD'])
#
#     async def read_from_serial():
#         while True:
#             logger.info("Data available on serial port.")
#             line = ser.readline().decode().strip()
#             data = await process_line(line)
#             if data:
#                 telemetry_data = TelemetryData(
#                     timestamp=datetime.utcnow(),
#                     session_name=processor.current_session,
#                     channels=data
#                 )
#                 # Log parsed telemetry data
#                 # logger.info(f"Raw data from serial: {line}")
#                 # logger.info(f"Parsed telemetry data: {telemetry_data}")
#
#                 # Save to Redis and Emit to Socket.IO
#                 await processor.save_to_redis(data)
#                 saved_data = await processor.save_to_redis(data)
#                 # logger.info(f"Data saved to Redis.")
#                 logger.info(f"Data saved to Redis: {saved_data}")
#                 await sio.emit("telemetry_update", saved_data)
#                 await asyncio.sleep(0.01)  # Adjust rate as needed
#
#     await asyncio.create_task(read_from_serial())
#
#     yield
#
#     if ser:
#         ser.close()
#
#     if redis_client:
#         await redis_client.aclose()


# Setup FastAPI app and sockets
app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.ASGIApp(sio, app)

origins = [
    "http://localhost:4000",
]


@app.on_event("startup")
async def start_serial_reading():
    logger.info("Starting serial reading...")
    ser = serial.Serial(SERIAL_CONFIG['PORT'], SERIAL_CONFIG['BAUD_RATE'], timeout=SERIAL_CONFIG['TIMEOUT'])
    processor = SerialProcessor()
    await redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)

    async def read_from_serial():
        while True:
            # logger.info("Data available on serial port.")
            line = ser.readline().decode().strip()
            data = await process_line(line)
            if data:
                telemetry_data = TelemetryData(
                    timestamp=datetime.utcnow(),
                    session_name=processor.current_session,
                    channels=data
                )
                # Raw telemetry data logging
                # logger.info(f"Raw data from serial: {line}")
                # logger.info(f"Parsed telemetry data: {telemetry_data}")

                # Save to Redis and Emit to Socket.IO
                await processor.save_to_redis(data)
                saved_data = await processor.save_to_redis(data)
                logger.info(f"Data saved to Redis.")
                logger.info(f"Data saved to Redis: {saved_data}")
                await asyncio.sleep(0.01)  # Adjust rate as needed

    await asyncio.create_task(read_from_serial())


async def get_latest_data_from_redis() -> Optional[Tuple[str, TelemetryData]]:
    keys = await redis_client.keys("telemetry_at_*")
    if not keys:
        return None

    latest_key = max(keys, key=lambda k: k.replace("telemetry_at_", ""))
    data = await redis_client.get(latest_key)
    if data:
        return latest_key, TelemetryData(**json.loads(data))
    return None


# manage backpressure and websocket connection
class ClientManager:
    def __init__(self):
        self.clients = {}  # Store client-specific settings
        self.default_rate = 0.02  # Default emission rate in seconds

    def add_client(self, client_id, capacity=1000, process_interval=16):
        self.clients[client_id] = {
            'capacity': capacity,
            'process_interval': process_interval,
            'dropped_messages': 0,
            'last_emit': 0
        }

    def remove_client(self, client_id):
        if client_id in self.clients:
            del self.clients[client_id]

    def should_emit(self, client_id):
        if client_id not in self.clients:
            return True

        client = self.clients[client_id]
        current_time = time.time()

        # Check if enough time has passed since last emission
        if current_time - client['last_emit'] >= (client['process_interval'] / 1000):
            client['last_emit'] = current_time
            return True
        return False


client_manager = ClientManager()

# Initialize Test Server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4500, log_level="info")
