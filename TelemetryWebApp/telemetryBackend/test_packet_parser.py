"""Tests for packet_parser. Run with:  python -m pytest test_packet_parser.py"""

import io
import struct

from packet_parser import NO_FUEL, PacketReader, crc8


def build_main(channels, seq=0, frame_6e=b"\x00" * 8):
    data = struct.pack("<20h", *channels) + frame_6e
    return b"\x55\xAA" + bytes([seq]) + data + bytes([crc8(data)])


def build_fuel(rate_lph, used_l, stale=False, seq=0):
    rate = 0xFFFFFFFF if rate_lph is None else round(rate_lph * 1000)
    used = 0xFFFFFFFF if used_l is None else round(used_l * 1_000_000)
    f = bytearray([0x55, 0xAB, 3, 10, seq]) + struct.pack("<II", rate, used) + bytes([1 if stale else 0])
    f.append(crc8(bytes(f[2:14])))
    return bytes(f)


CH = list(range(20))


def read(stream):
    return PacketReader(io.BytesIO(stream)).read_packet()


def test_main_and_fuel():
    raw, fuel = read(build_main(CH) + build_fuel(12.5, 2.345678))
    assert raw == CH
    rate, used, valid = fuel
    assert rate == 12.5
    assert abs(used - 2.345678) < 1e-9
    assert valid == 1.0


def test_stale_flag_and_missing_total():
    _, fuel = read(build_main(CH) + build_fuel(0, None, stale=True))
    assert fuel == [0.0, -1.0, 0.0]


def test_main_without_fuel_block():
    r = PacketReader(io.BytesIO(build_main(CH, seq=1) + build_main(CH, seq=2)))
    assert r.read_packet()[1] == NO_FUEL
    assert r.read_packet()[0] == CH   # second packet not lost


def test_corrupt_fuel_keeps_main_data():
    fuel = bytearray(build_fuel(10, 1))
    fuel[7] ^= 0xFF
    raw, f = read(build_main(CH) + bytes(fuel))
    assert raw == CH
    assert f == NO_FUEL


def test_corrupt_main_skipped_then_resyncs():
    bad = bytearray(build_main(CH))
    bad[10] ^= 0xFF
    raw, fuel = read(b"\x12\x55" + bytes(bad) + build_fuel(1, 1) + build_main([5] * 20) + build_fuel(3, 4))
    assert raw == [5] * 20
    assert fuel[1] == 4


def test_packet_split_across_timeouts():
    full = build_main(CH) + build_fuel(8, 0.5)

    class Chunked:
        def __init__(self, parts): self.parts = list(parts)
        def read(self, n): return self.parts.pop(0) if self.parts else b""

    r = PacketReader(Chunked([full[:20], b"", full[20:60], full[60:]]))
    assert r.read_packet() is None            # timed out mid-packet
    raw, fuel = r.read_packet()
    assert raw == CH and fuel[1] == 0.5


def test_negative_channels():
    ch = [-1, -32768, 32767] + [0] * 17
    assert read(build_main(ch))[0] == ch
