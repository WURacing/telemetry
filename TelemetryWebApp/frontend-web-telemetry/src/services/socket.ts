// src/services/socket.ts
import { io } from 'socket.io-client';

// The secure URL for your backend
const URL = 'https://api.telemetry.washuracing.com';

export const socket = io(URL, {
    transports: ['websocket'],
    autoConnect: false // We will connect manually when the user clicks the "Begin Streaming" button
});