"""Checks GetDataFromCar.read_packet against a packet made by the real Telemetry Sender.

GOLDEN_PACKET was captured from the firmware host test
(2026/tests/Telemetry_Sender, RadioPacketCarriesAimFramesAndFuelFrame).
If the Sender's packet layout changes, capture a new one and update both sides.

Run from this folder:  python -m pytest test_get_data_from_car.py
"""

import io
import os

os.environ.setdefault("REDIS_PORT", "6379")  # GetDataFromCar reads this on import

import GetDataFromCar as gdc  # noqa: E402

GOLDEN_PACKET = bytes.fromhex(
    "55aa0104"                                  # sync, version 1, sequence 4
    "0102030405060708"                          # 0x69
    "0000000000007017"                          # 0x6A: RPM 6000 in bytes 6-7
    "000000000000000000000000000000000000000000000000"  # 0x6B, 0x6C, 0x6D
    "3903020000000000"                          # 0x33: 8.25 L/h, 2 mL used
    "19"                                        # CRC-8 over bytes 2-51
)


def read(data: bytes):
    gdc.link_stats.__init__()
    return gdc.read_packet(io.BytesIO(data))


def test_golden_packet_decodes():
    assert len(GOLDEN_PACKET) == 53
    channels = read(GOLDEN_PACKET)
    assert len(channels) == 21
    assert channels[7] == 6000                  # RPM
    assert abs(channels[20] - 0.002) < 1e-9     # FuelUsed, L


def test_wrong_version_is_rejected():
    bad = bytearray(GOLDEN_PACKET)
    bad[2] = 2
    assert read(bytes(bad)) is None


def test_corrupt_packet_is_dropped():
    bad = bytearray(GOLDEN_PACKET)
    bad[20] ^= 0xFF
    assert read(bytes(bad)) is None


def test_junk_before_packet_is_skipped():
    assert read(b"\x12\x34\x55" + GOLDEN_PACKET) is not None


def test_lost_packets_are_counted():
    gdc.link_stats.__init__()
    for seq in (4, 5, 8):                       # 6 and 7 never arrive
        packet = bytearray(GOLDEN_PACKET)
        packet[3] = seq
        packet[-1] = gdc._crc8(bytes(packet[2:-1]))
        assert gdc.read_packet(io.BytesIO(bytes(packet))) is not None
    assert (gdc.link_stats.received, gdc.link_stats.lost) == (3, 2)
