import { io, Socket } from 'socket.io-client';
import { useFileStoreStore } from '../stores/FileStore';
import type { TelemetryData } from '../types/telemetry';

class WebSocketService {
    private store: ReturnType<typeof useFileStoreStore>;
    private socket: Socket | null = null;


    constructor() {
        this.store = useFileStoreStore(); // Instantiate now
    }

    connect() {
        this.socket = io('http://localhost:4000', { transports: ['websocket'] });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket?.on('connected', (data: any) => {
            console.log('Socket ID:', data.sid); // Log or store the sid if needed
        });

        this.socket.on('telemetry_update', (data: TelemetryData) => {
            this.store.updateCollectedData(
                [...this.store.FrBrakePressure, data.channels[1]].slice(-100),
                [...this.store.SteeringAngle, data.channels[3]].slice(-100),
                [...this.store.FRBrakeTemp, data.channels[5]].slice(-100),
                [...this.store.FLBrakeTemp, data.channels[7]].slice(-100),
                [...this.store.Pitot, data.channels[11]].slice(-100),
                [...this.store.FrAccX, data.channels[12]].slice(-100),
                [...this.store.FrAccY, data.channels[13]].slice(-100),
                [...this.store.FrAccZ, data.channels[14]].slice(-100),
                [...this.store.FrGyroX, data.channels[15]].slice(-100),
                [...this.store.FrGyroY, data.channels[16]].slice(-100),
                [...this.store.FrGyroZ, data.channels[17]].slice(-100),
                [...this.store.FrMagX, data.channels[18]].slice(-100),
                [...this.store.FrMagY, data.channels[19]].slice(-100),
                [...this.store.ShockPotRL, data.channels[20]].slice(-100),
                [...this.store.RLBrakeTemp, data.channels[21]].slice(-100),
                [...this.store.RRBrakeTemp, data.channels[25]].slice(-100),
                [...this.store.ReBrakePressure, data.channels[26]].slice(-100),
                [...this.store.LatAcc, data.channels[28]].slice(-100),
                [...this.store.LongAcc, data.channels[29]].slice(-100),
                [...this.store.RearAccZ, data.channels[30]].slice(-100),
                [...this.store.RearGyroX, data.channels[31]].slice(-100),
                [...this.store.RearGyroY, data.channels[32]].slice(-100),
                [...this.store.RearGyroZ, data.channels[33]].slice(-100),
                [...this.store.RearMagX, data.channels[34]].slice(-100),
                [...this.store.RearMagY, data.channels[35]].slice(-100),
                [...this.store.ClutchPosition, data.channels[36]].slice(-100),
                [...this.store.ClutchL, data.channels[37]].slice(-100),
                [...this.store.ClutchR, data.channels[38]].slice(-100),
                [...this.store.Time, Date.now()].slice(-100)
            );
        });

        this.socket.on('disconnect', () => {
            if (this.socket) {
                this.socket.removeAllListeners();
            }
            console.log('Disconnected from WebSocket server');
            this.store.updateCollectedData(
                [], [], [], [], [], [], [], [], [], [],
                [], [], [], [], [], [], [], [], [], [],
                [], [], [], [], [], [], [], [], [] 
            );
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
