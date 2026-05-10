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
            console.log('[telemetry] update received, channels:', data?.channels?.length, data?.channels);
            const store = useFileStoreStore();
            const ch = data.channels;

            // Require a full 20-channel packet before updating.
            if (!ch || ch.length < 20) {
                console.warn('[telemetry] packet rejected — only', ch?.length, 'channels');
                return;
            }

            const rolling = (currentArray: unknown, newValue: number): number[] => {
                const arr = Array.isArray(currentArray) ? currentArray : [];
                return [...arr, newValue].slice(-300);
            };

            // Channel indices match FRAME_IDS order in Telemetry_Sender.ino.
            // Factors/offsets are applied in GetDataFromCar.py — values here are physical.
            store.updateCollectedData({
                // AIM_Suspension (frame 0x69)
                ShockPotFL:       rolling(store.ShockPotFL,       ch[0]),
                ShockPotFR:       rolling(store.ShockPotFR,       ch[1]),
                ShockPotRL:       rolling(store.ShockPotRL,       ch[2]),
                ShockPotRR:       rolling(store.ShockPotRR,       ch[3]),
                // AIM_Chassis (frame 0x6A)
                SteeringAngle:    rolling(store.SteeringAngle,    ch[4]),
                FrBrakePressure:  rolling(store.FrBrakePressure,  ch[5]),
                RrBrakePressure:  rolling(store.RrBrakePressure,  ch[6]),
                EngineRPM:        rolling(store.EngineRPM,        ch[7]),
                // AIM_Engine1 (frame 0x6B)
                ThrottlePosition: rolling(store.ThrottlePosition, ch[8]),
                MAP:              rolling(store.MAP,               ch[9]),
                CoolantTemp:      rolling(store.CoolantTemp,      ch[10]),
                OilPressure:      rolling(store.OilPressure,      ch[11]),
                // AIM_Engine2 (frame 0x6C)
                OilTemp:          rolling(store.OilTemp,          ch[12]),
                FuelPressure:     rolling(store.FuelPressure,     ch[13]),
                Lambda:           rolling(store.Lambda,            ch[14]),
                GearPos:          rolling(store.GearPos,          ch[15]),
                // AIM_Sensors (frame 0x6D)
                MAT:              rolling(store.MAT,              ch[16]),
                GPSSpeed:         rolling(store.GPSSpeed,         ch[17]),
                GPSXPos:          rolling(store.GPSXPos,          ch[18]),
                GPSYPos:          rolling(store.GPSYPos,          ch[19]),
                Time:             rolling(store.Time,             Date.now()),
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
