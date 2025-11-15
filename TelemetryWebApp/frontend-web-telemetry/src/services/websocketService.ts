// src/services/websocketService.ts
import { useFileStoreStore, type TelemetryField } from '../stores/FileStore';
import type { TelemetryData } from '../types/telemetry';
import { socket } from "./socket.ts";

class WebSocketService {
    constructor() {
        this.initializeEventListeners();
    }

    connect() {
        if (socket.connected) return;
        socket.connect();
    }

    disconnect() {
        if (socket.connected) {
            socket.disconnect();
        }
    }

    private initializeEventListeners() {
        if (socket.hasListeners('connect')) return;

        socket.on('connect', () => {
            console.log('Connected to WebSocket server with ID:', socket.id);
        });

        socket.on('telemetry_update', (data: TelemetryData) => {
            const store = useFileStoreStore();

            // --- REFACTORED ROLLING LOGIC ---
            // This helper function now takes the array directly
            const rolling = (currentArray: number[], newValue: number): number[] => {
                if (!Array.isArray(currentArray)) {
                    // This safety check should no longer be needed, but it's good practice.
                    console.error("Invalid array passed to rolling function:", currentArray);
                    return [newValue];
                }
                const newArray = [...currentArray, newValue];
                return newArray.slice(-100); // Keep the last 100 data points
            };

            // Now we call rolling with the actual reactive array's value
            store.updateCollectedData({
                FrBrakePressure: rolling(store.FrBrakePressure.value, data.channels[1]),
                SteeringAngle:   rolling(store.SteeringAngle.value, data.channels[3]),
                LatAcc:          rolling(store.LatAcc.value, data.channels[28]),
                LongAcc:         rolling(store.LongAcc.value, data.channels[29]),
                Time:            rolling(store.Time.value, Date.now())
            });
        });

        socket.on('disconnect', () => {
            const store = useFileStoreStore();
            console.log('Disconnected from WebSocket server');
            store.clearCollectedData();
        });

        socket.on('connect_error', (err: Error) => {
            console.error(`Connection error: ${err.message}`);
        });
    }
}

export { WebSocketService };