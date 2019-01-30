import serial
import global_vars
import struct

class SerialInterface():
	def __init__(self, port):
		self.ser = serial.Serial(port)

	def record(self, prefix, timestamp, payload):
		with open(global_vars.filenames[prefix], 'a') as csvfile:
			csvfile.write(str(timestamp)+','+str(payload)+'\n')

	def unpack(self, key, lock):
		name = global_vars.key_table[key][0]

		timestamp = struct.unpack('>I',ser.read(4))[0]
		payload = struct.unpack('>f',ser.read(4))[0]
		with lock:
			global_vars.data[name] = payload
			record(prefix=name,timestamp=timestamp,payload=payload)

	def readData(self, lock, stop_event):
		self.ser.flush()
		while not stop_event.is_set():
			if (ser.inWaiting() > 0):
				data = ser.read()
				if (data == bytes(b'!')):
					data = ser.read()

					# Packet Headers:
					# 0x30 : RPMs
					# 0x31 : Engine Load
					# 0x32 : throttle
					# 0x33 : Coolant Temp (F)
					# 0x34 : O2 level
					# 0x35 : Vehicle Speed
					# 0x36 : Gear (Again)
					# 0x37 : Battery Voltage
					# 0x38 : Shock pot sensor on right rear wheel
					# 0x39 : Shock pot sensor on left rear wheel

					self.unpack(key=data, lock=lock)

				else:
					pass
			else:
				pass

	def cleanup():
		global ser
		ser.close()