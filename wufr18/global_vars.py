import os
from datetime import datetime

"""
TODO: replace with a redis database
For the time being, this and appropriate data
locks will act as a database for all most
recent recorded values
"""

def init():
	"""
	These must be the same order as 
	"""
	global prefixes
	prefixes = [
		"RPMs", "Load", "Throttle", "Coolant",
		"O2", "Speed", "Gear",
		"Volts", "RRPot", "RLPot",
		"FBrake", "RBrake", "Intake",
		"Ignition", "SeatAccX", "SeatAccY",
		"SeatAccZ", "WheelAccX", "WheelAccY",
		"WheelAccZ", "MAP", "InnerMAP"
	]

	global key_table
	key_table = {
		bytes(b'0'): ["RPMs", ">f", 4, True],
		bytes(b'1'): ["Load", ">f", 4, True],
		bytes(b'2'): ["Throttle", ">f", 4, True],
		bytes(b'3'): ["Coolant", ">f", 4, False],
		bytes(b'4'): ["O2", ">f", 4, False],
		bytes(b'5'): ["Speed", ">f", 4, False],
		bytes(b'6'): ["Gear", "", 1, False],
		bytes(b'7'): ["Volts", ">f", 4, False],
		bytes(b'8'): ["RRPot", ">f", 4, True],
		bytes(b'9'): ["RLPot", ">f", 4, True],
		bytes(b'@'): ["FBrake", ">f", 4, True],
		bytes(b'A'): ["RBRake", ">f", 4, True],
		bytes(b'D'): ["Intake", ">f", 4, True],
		bytes(b'E'): ["Ignition", ">f", 4, True],
		bytes(b'F'): ["SeatAccX", ">f", 4, True],
		bytes(b'G'): ["SeatAccY", ">f", 4, True],
		bytes(b'H'): ["SeatAccZ", ">f", 4, True],
		bytes(b'I'): ["WheelAccX", ">f", 4, True],
		bytes(b'J'): ["WheelAccY", ">f", 4, True],
		bytes(b'K'): ["WheelAccZ", ">f", 4, True],
		bytes(b'R'): ["MAP", ">f", 4, True],
		bytes(b'S'): ["InnerMAP", ">f", 4, True],
	}

	global primaries
	primaries = ["RPMs","Load","Throttle","RRPot","RLPot", "FBrake", "RBrake", "Intake", "Ignition", "SeatAccX", "SeatAccY", "SeatAccZ", "WheelAccX", "WheelAccY", "WheelAccZ", "MAP", "InnerMAP"]

	global secondaries
	secondaries = ["Coolant","O2","Speed","Gear","Volts"]

	global data
	data = {prefix: 0 for prefix in prefixes}

	sep = "\\" if os.name == "nt" else "/"
	directory = os.getcwd()+sep+"logs"+sep+"Engine Data "+datetime.today().strftime('%m-%d-%Y')+" "+datetime.now().strftime('%H:%M:%S')+sep
	if not os.path.exists(directory):
		os.makedirs(directory)

	global filenames
	filenames = {prefix: directory+prefix+".csv" for prefix in prefixes}