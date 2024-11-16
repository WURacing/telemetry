from fastapi import FastAPI, HTTPException, Depends
from redis.asyncio.client import Redis
from typing import List, Optional, Tuple
from pydantic import BaseModel
from datetime import datetime
import asyncio
import time
import uvicorn
import socketio
import redis.asyncio as redis
import json
import logging

REDIS_CONFIG = {
    'HOST': 'redis-13487.c12.us-east-1-4.ec2.redns.redis-cloud.com',
    'PORT': 13487,
    'DB': 12635445,
    'PASSWORD': 'Py0BLbmkxrGWNUF2basWNOEplbuubfc3'
}


class TelemetryData(BaseModel):
    timestamp: datetime
    session_name: str
    channels: list[float]


redis_client: Optional[Redis] = Redis(host=REDIS_CONFIG['HOST'], port=REDIS_CONFIG['PORT'], password=REDIS_CONFIG['PASSWORD'])
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = socketio.ASGIApp(sio)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print('Client disconnected:', sid)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
