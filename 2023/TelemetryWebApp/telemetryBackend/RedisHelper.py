from fastapi import FastAPI, HTTPException, Depends
from redis.asyncio.client import Redis
from typing import List, Optional, Tuple
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
import asyncio
import os
import uvicorn
import socketio
import json
import logging

load_dotenv()

# Get Redis credentials from the OS
REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = int(os.environ.get("REDIS_PORT"))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")


class TelemetryData(BaseModel):
    timestamp: str
    session_name: str
    channels: list[float]


redis_client: Optional[Redis] = Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI()
sio_app = socketio.ASGIApp(sio, app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# await sio.emit("telemetry_update", saved_data)
# async def get_latest_data_from_redis() -> Optional[Tuple[str, TelemetryData]]:
#     keys = await redis_client.keys("telemetry_at_*")
#     if not keys:
#         return None
#
#     latest_key = max(keys, key=lambda k: k.replace("telemetry_at_", ""))
#     data = await redis_client.get(latest_key)
#     if data:
#         return latest_key, TelemetryData(**json.loads(data))
#     return None


@app.on_event("startup")
async def startup_event():
    global redis_client  # Access the global variable
    redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)
    asyncio.create_task(redis_streamer())  # Start the streaming task


async def redis_streamer():
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("telemetry_channel")  # Subscribe to the Redis channel

    async for message in pubsub.listen():
        if message["type"] == "message":
            data = json.loads(message["data"])
            telemetry_data = TelemetryData(**data)  # Create TelemetryData instance
            await sio.emit("telemetry_update", telemetry_data.dict())  # Emit the dictionary


@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit("connected", data={'sid': sid}, to=sid)  # Send SID to client


@sio.event
async def disconnect(sid):
    print('Client disconnected:', sid)


if __name__ == "__main__":
    uvicorn.run(sio_app, host="0.0.0.0", port=4000)
