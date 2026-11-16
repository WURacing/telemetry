export interface TelemetryData {
    timestamp: string;
    session_name: string;
    channels: number[];
}

// Add channel mapping type for type safety
export interface ChannelMap {
    latAcc: number;
    longAcc: number;
    engineRPM: number;
    gpsX: number;
    gpsY: number;
    airSpeed: number;
    brakePressure: number;
    throttlePosition: number;
    oilPressure: number;
    oilTemp: number;
}
