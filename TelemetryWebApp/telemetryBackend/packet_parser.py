"""
Decoder for the radio packets sent by firmware/2026/Telemetry/Telemetry_Sender.

Each transmission (every 200 ms) is 67 bytes:

  Main block (52 bytes)
    [0x55][0xAA][SEQ:1][DATA:48][CRC8 of DATA:1]
    DATA is six 8-byte CAN frames in order 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E.
    The first 40 bytes (0x69-0x6D) are 20 little-endian int16 channels.
    Frame 0x6E (FuelOpenTime) is only used by the fuel meter and is skipped here.

  Fuel block (15 bytes)
    [0x55][0xAB][TYPE=3][LEN=10][SEQ:1][RATE:u32][USED:u32][STALE:1][CRC8 of bytes 2..13]
    RATE  = fuel flow in L/h  x 1000      (0xFFFFFFFF = missing)
    USED  = fuel used since last reset in L x 1,000,000 (0xFFFFFFFF = missing)
    STALE = 0 when RPM and injector pulse are fresh, 1 otherwise

The parser works on any object with a pyserial-style read(n) method, so it can
be tested with io.BytesIO instead of real hardware.
"""

import logging
import struct
from dataclasses import dataclass
from typing import List, Optional

logger = logging.getLogger(__name__)

MAIN_SYNC = b"\x55\xAA"
MAIN_DATA_LEN = 48                       # 6 CAN frames x 8 bytes
MAIN_LEN = 2 + 1 + MAIN_DATA_LEN + 1     # sync + seq + data + crc = 52
NUM_CHANNELS = 20                        # frames 0x69-0x6D, 4 int16 each

FUEL_SYNC = b"\x55\xAB"
FUEL_TYPE = 3
FUEL_PAYLOAD_LEN = 10
FUEL_LEN = 15
MISSING_U32 = 0xFFFFFFFF


def crc8(data: bytes) -> int:
    """CRC-8, polynomial 0x07, init 0 - matches crc8() in Telemetry_Sender.ino."""
    crc = 0
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = ((crc << 1) ^ 0x07) if crc & 0x80 else (crc << 1)
            crc &= 0xFF
    return crc


@dataclass
class FuelReading:
    rate_lph: Optional[float]   # litres per hour, None if missing
    used_l: Optional[float]     # litres used since last meter reset, None if missing
    valid: bool                 # False when the car flags its inputs as stale

    def to_dict(self) -> dict:
        return {"rate_lph": self.rate_lph, "used_l": self.used_l, "valid": self.valid}


@dataclass
class Packet:
    raw_channels: List[int]           # 20 unscaled int16 values
    fuel: Optional[FuelReading]       # None if the fuel block was missing or corrupt


class PacketReader:
    def __init__(self, stream):
        self.stream = stream
        self.buf = bytearray()

    def _ensure(self, n: int) -> bool:
        """Read until the buffer holds at least n bytes. False on timeout/EOF."""
        while len(self.buf) < n:
            chunk = self.stream.read(n - len(self.buf))
            if not chunk:
                return False
            self.buf.extend(chunk)
        return True

    def read_packet(self) -> Optional[Packet]:
        """Return the next valid packet, or None if the stream timed out first.
        Partial data is kept in the buffer for the next call."""
        while True:
            start = self.buf.find(MAIN_SYNC)
            if start < 0:
                # Keep a trailing 0x55 in case it is the first half of a sync.
                del self.buf[:-1]
                if not self._ensure(len(self.buf) + 1):
                    return None
                continue
            del self.buf[:start]

            if not self._ensure(MAIN_LEN):
                return None

            data = bytes(self.buf[3:3 + MAIN_DATA_LEN])
            received = self.buf[MAIN_LEN - 1]
            if crc8(data) != received:
                logger.warning(f"CRC mismatch — got 0x{received:02X}, expected 0x{crc8(data):02X} — dropping packet")
                del self.buf[:1]      # skip this sync and rescan
                continue
            del self.buf[:MAIN_LEN]

            raw = list(struct.unpack_from("<20h", data))
            return Packet(raw_channels=raw, fuel=self._read_fuel())

    def _read_fuel(self) -> Optional[FuelReading]:
        if not self._ensure(2) or bytes(self.buf[:2]) != FUEL_SYNC:
            return None               # leave the bytes for the next sync search
        if not self._ensure(FUEL_LEN):
            return None

        block = bytes(self.buf[:FUEL_LEN])
        if (block[2] != FUEL_TYPE or block[3] != FUEL_PAYLOAD_LEN
                or crc8(block[2:14]) != block[14]):
            logger.warning("Fuel block failed header/CRC check — ignoring fuel for this packet")
            del self.buf[:2]
            return None
        del self.buf[:FUEL_LEN]

        rate_raw, used_raw = struct.unpack_from("<II", block, 5)
        return FuelReading(
            rate_lph=None if rate_raw == MISSING_U32 else rate_raw / 1000.0,
            used_l=None if used_raw == MISSING_U32 else used_raw / 1_000_000.0,
            valid=block[13] == 0,
        )
