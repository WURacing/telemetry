export interface FuelData {
    rate_lph: number | null;  // fuel flow, litres per hour
    used_l: number | null;    // litres used since the meter was last reset
    valid: boolean;           // false when the car reports stale RPM/injector inputs
}

export interface TelemetryData {
    timestamp: string;
    session_name: string;
    channels: number[];
    fuel?: FuelData | null;   // null/missing when the fuel block didn't arrive
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
