from flask import Flask, render_template
from flask_socketio import SocketIO
from threading import Thread, Lock
from serial_ports import get_port

import eventlet
import atexit
import global_vars
import serial_thread

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

thread = None
lock = Lock()

eventlet.monkey_patch()

if __name__ == "__main__":
	global thread
	global lock

	serial_thread.init(get_port())
	global_vars.init()

	socketio.run(app)