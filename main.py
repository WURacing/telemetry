from flask import Flask, render_template, url_for
from flask_socketio import SocketIO
from threading import Thread, Lock, Event
from serial_ports import get_port

import time
import eventlet
import atexit
import global_vars
import serial_thread

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

eventlet.monkey_patch()

ser_thread = None
emit_thread1 = None
emit_thread2 = None
lock = Lock()
stop_event = Event()

@app.route('/')
def index():
	global emit_thread1
	global emit_thread2

	if emit_thread1 is None:
		emit_thread1 = Thread(target=emitData,args=(global_vars.primaries,0.2))
		emit_thread1.start()

	if emit_thread2 is None:
		emit_thread2 = Thread(target=emitData,args=(global_vars.secondaries,1))
		emit_thread2.start()

	return render_template('index.html')

def emitData(keys,delay):
	global lock
	global stop_event
	while not stop_event.is_set():
		with lock:
			message = {key: global_vars.data[key] for key in keys}
		print(message)
		socketio.emit('message', message)
		time.sleep(delay)

def cleanup():
	global stop_event
	stop_event.set()
	if emit_thread1 is not None:
		emit_thread1.join()
	if emit_thread2 is not None:
		emit_thread2.join()
	if ser_thread is not None:
		ser_thread.join()
	serial_thread.cleanup()

if __name__ == "__main__":
	serial_thread.init(get_port())
	global_vars.init()

	atexit.register(cleanup)

	ser_thread = Thread(target=serial_thread.readData, args=(lock,stop_event))
	ser_thread.start()

	socketio.run(app)