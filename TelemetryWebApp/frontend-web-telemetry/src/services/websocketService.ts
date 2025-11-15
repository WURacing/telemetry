import { io, Socket } from 'socket.io-client';
import { useFileStoreStore, type TelemetryField } from '../stores/FileStore';
import type { TelemetryData } from '../types/telemetry';

class WebSocketService {
    private store: ReturnType<typeof useFileStoreStore>;
    private socket: Socket | null = null;


    constructor() {
        this.store = useFileStoreStore(); // Instantiate now
    }

    connect() {
        this.socket = io('https://api.telemetry.mooo.com', { transports: ['websocket'] });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket?.on('connected', (data: any) => {
            console.log('Socket ID:', data.sid); // Log or store the sid if needed
        });

        this.socket.on('telemetry_update', (data: TelemetryData) => {
            const rolling = (field: TelemetryField, value: number) => {
                const current = this.store[field];
                return [...current.value, value].slice(-100);
            };

            this.store.updateCollectedData({
                FrBrakePressure: rolling('FrBrakePressure', data.channels[1]),
                SteeringAngle: rolling('SteeringAngle', data.channels[3]),
                LatAcc: rolling('LatAcc', data.channels[28]),
                LongAcc: rolling('LongAcc', data.channels[29]),
                Time: rolling('Time', Date.now())
            });
        });

        this.socket.on('disconnect', () => {
            if (this.socket) {
                this.socket.removeAllListeners();
            }
            console.log('Disconnected from WebSocket server');
            this.store.clearCollectedData();
        });

        this.socket.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
        });

        this.socket.on('connect_error', (err) => {
            console.error(`Connection error: ${err.message}`);
        });
     }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export { WebSocketService };
