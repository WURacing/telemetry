import { io, Socket } from 'socket.io-client';
import { useFileStoreStore } from '../stores/FileStore';
import type { TelemetryData, TelemetryMetrics, ChannelMap } from '../types/telemetry';

class WebSocketService {
    // private store = useFileStoreStore();
    private socket: Socket | null = null;
    private messageQueue: TelemetryData[] = [];
    private processingQueue = false;
    private maxQueueSize = 1000; // Maximum number of messages to buffer
    private processInterval = 16; // ~60fps for smooth updates
    private lastProcessTime = 0;
    private droppedMessages = 0;

    private async processMessageQueue() {
        if (this.processingQueue) return;
        this.processingQueue = true;

        while (this.messageQueue.length > 0) {
            const now = performance.now();
            const timeSinceLastProcess = now - this.lastProcessTime;

            // Ensure we maintain our target frame rate
            if (timeSinceLastProcess < this.processInterval) {
                await new Promise(resolve =>
                    setTimeout(resolve, this.processInterval - timeSinceLastProcess)
                );
            }

            const data = this.messageQueue.shift();
            if (!data) continue;

            try {
                // Map the channels array to specific metrics based on their index
                const channelMap = {
                    latAcc: data.channels[0],
                    longAcc: data.channels[1],
                    engineRPM: data.channels[2],
                    gpsX: data.channels[3],
                    gpsY: data.channels[4],
                    airSpeed: data.channels[5],
                    brakePressure: data.channels[6],
                    throttlePosition: data.channels[7],
                    oilPressure: data.channels[8],
                    oilTemp: data.channels[9]
                };

                this.lastProcessTime = performance.now();
            } catch (error) {
                console.error('Error processing telemetry data:', error);
            }
        }

        this.processingQueue = false;
    }

    private handleBackpressure() {
        // If queue is getting too large, drop the oldest messages
        if (this.messageQueue.length > this.maxQueueSize) {
            const toRemove = this.messageQueue.length - this.maxQueueSize;
            this.messageQueue.splice(0, toRemove);
            this.droppedMessages += toRemove;

            // Log warning if we're dropping messages
            if (this.droppedMessages > 0 && this.droppedMessages % 100 === 0) {
                console.warn(`Dropped ${this.droppedMessages} messages due to backpressure`);

                // Notify server to potentially adjust send rate
                this.socket?.emit('backpressure', {
                    droppedMessages: this.droppedMessages,
                    queueSize: this.messageQueue.length
                });
            }
        }
    }

    connect() {
        this.socket = io('http://localhost:4000', {
            transports: ['websocket'],
            // Add backpressure configuration
            query: {
                clientCapacity: this.maxQueueSize.toString(),
                processInterval: this.processInterval.toString()
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.droppedMessages = 0; // Reset counter on new connection
        });

        this.socket.on('telemetry_update', (data: TelemetryData) => {
            this.messageQueue.push(data);
            this.handleBackpressure();
            console.log('Telemetry Data:' + data);

            // Start processing queue if not already processing
            if (!this.processingQueue) {
                this.processMessageQueue();
            }
        });

        // Handle server-side rate adjustment requests
        this.socket.on('adjust_rate', (adjustment: { interval: number }) => {
            this.processInterval = adjustment.interval;
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
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
            // Clear message queue before disconnecting
            this.messageQueue = [];
            this.droppedMessages = 0;
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Allow external configuration of processing parameters
    configure(options: { maxQueueSize?: number; processInterval?: number }) {
        this.maxQueueSize = options.maxQueueSize || this.maxQueueSize;
        this.processInterval = options.processInterval || this.processInterval;
    }

    // Get current performance metrics
    getMetrics() {
        return {
            queueSize: this.messageQueue.length,
            droppedMessages: this.droppedMessages,
            processInterval: this.processInterval,
            isProcessing: this.processingQueue
        };
    }
}

export const wsService = new WebSocketService();
