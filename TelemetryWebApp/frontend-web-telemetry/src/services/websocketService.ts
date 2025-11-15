import { io, Socket } from 'socket.io-client';
import { useFileStoreStore, type TelemetryField } from '../stores/FileStore';
import type { TelemetryData } from '../types/telemetry';

// Assuming you have the shared socket instance from the previous step
import { socket } from './socket';

class WebSocketService {
    // REMOVE the store property and the constructor
    // private store: ReturnType<typeof useFileStoreStore>;
    // constructor() {
    //     this.store = useFileStoreStore();
    // }

    connect() {
        // This part remains the same, but we will modify the event listeners
        if (socket.connected) return;

        // Initialize listeners once upon connection
        this.initializeEventListeners();
        socket.connect();
    }

    disconnect() {
        if (socket) {
            socket.disconnect();
        }
    }

    private initializeEventListeners() {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server with ID:', socket.id);
        });

        socket.on('telemetry_update', (data: TelemetryData) => {
            // GET THE STORE INSTANCE *INSIDE* THE EVENT HANDLER
            const store = useFileStoreStore();

            // This helper function now correctly uses the live store
            const rolling = (field: TelemetryField, value: number) => {
                // Accessing the store property (which is a ref) and then its .value
                const currentArray = store[field].value;
                
                // Safety check to ensure it's an array
                if (!Array.isArray(currentArray)) {
                    console.error(`Store field ${field} is not an array!`, currentArray);
                    return [value]; // Recover by starting a new array
                }
                
                return [...currentArray, value].slice(-100);
            };

            store.updateCollectedData({
                FrBrakePressure: rolling('FrBrakePressure', data.channels[1]),
                SteeringAngle: rolling('SteeringAngle', data.channels[3]),
                LatAcc: rolling('LatAcc', data.channels[28]),
                LongAcc: rolling('LongAcc', data.channels[29]),
                // IMPORTANT: You need a Time value for the charts to work
                Time: rolling('Time', Date.now()) 
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

        // Remove all listeners on disconnect to prevent memory leaks if re-connecting
        socket.on('disconnect', () => {
            socket.removeAllListeners();
        });
    }
}

export { WebSocketService };