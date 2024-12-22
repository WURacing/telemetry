import { io, Socket } from 'socket.io-client';
import { useFileStoreStore } from '../stores/FileStore';
import type { TelemetryData, ChannelMap } from '../types/telemetry';

class WebSocketService {
    private store: ReturnType<typeof useFileStoreStore>;
    private socket: Socket | null = null;


    constructor() {
        this.store = useFileStoreStore(); // Instantiate now
    }

    connect() {
        this.socket = io('http://localhost:4000', { transports: ['websocket'] });
        let buffer = new ArrayBuffer(0);

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket?.on('connected', (data: any) => {
            console.log('Socket ID:', data.sid); // Log or store the sid if needed
        });

        this.socket.on('telemetry_update', (data: TelemetryData) => {

            this.store.updateCollectedData(
                [...this.store.LatAcc, data.channels[0]].slice(-100), //Update store data
                [...this.store.LongAcc, data.channels[1]].slice(-100),
                [...this.store.EngineRPM, data.channels[2]].slice(-100),
                [...this.store.Time, Date.now()].slice(-100),  //Update timestamp, or use data.timestamp
                [...this.store.GPSXPos, data.channels[3]].slice(-100),
                [...this.store.GPSYPos, data.channels[4]].slice(-100),
                [...this.store.GPSSpeed, data.channels[5]].slice(-100),
                [...this.store.FrBrakePressure, data.channels[6]].slice(-100),
                [...this.store.ReBrakePressure, data.channels[7]].slice(-100),
                [...this.store.ThrottlePosition, data.channels[8]].slice(-100),
                [...this.store.OilPressure, data.channels[9]].slice(-100),
                [...this.store.OilTemp, data.channels[10]].slice(-100),
                [...this.store.ExternalVoltage, data.channels[11]].slice(-100),
                [...this.store.MAP, data.channels[12]].slice(-100),
                [...this.store.MAT, data.channels[13]].slice(-100),
                [...this.store.SteeringAngle, data.channels[14]].slice(-100),
                [...this.store.FuelPressure, data.channels[15]].slice(-100),
                [...this.store.GearPos, data.channels[16]].slice(-100),
                [...this.store.Lambda, data.channels[17]].slice(-100),
                [...this.store.CoolantTemp, data.channels[18]].slice(-100),
                [...this.store.FRBrakeTemp, data.channels[19]].slice(-100),
                [...this.store.FLBrakeTemp, data.channels[20]].slice(-100),
                [...this.store.RRBrakeTemp, data.channels[21]].slice(-100),
                [...this.store.RLBrakeTemp, data.channels[22]].slice(-100),
                // ... other channels
            );
        });

        this.socket.on('disconnect', () => {
            this.socket.removeAllListeners();
            console.log('Disconnected from WebSocket server');
            this.store.updateCollectedData([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
            buffer = new ArrayBuffer(0);
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
