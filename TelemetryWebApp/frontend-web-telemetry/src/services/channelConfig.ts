export interface ChannelConfig {
  yMin: number;
  yMax: number;
  yUnit: string;
  windowSamples: number;  // how many store samples to display (at 5 Hz: 75=15s, 150=30s, 300=60s)
}

export const channelConfig: Record<string, ChannelConfig> = {
  FrBrakePressure:  { yMin: 0,    yMax: 900,   yUnit: 'psi', windowSamples: 75  },
  RrBrakePressure:  { yMin: 0,    yMax: 900,   yUnit: 'psi', windowSamples: 75  },
  EngineRPM:        { yMin: 0,    yMax: 15000, yUnit: 'rpm', windowSamples: 150 },
  ThrottlePosition: { yMin: 0,    yMax: 100,   yUnit: '%',   windowSamples: 75  },
  SteeringAngle:    { yMin: -110, yMax: 110,   yUnit: 'deg', windowSamples: 75  },
  MAP:              { yMin: 0,    yMax: 300,   yUnit: 'kPa', windowSamples: 150 },
  CoolantTemp:      { yMin: 0,    yMax: 130,   yUnit: '°C',  windowSamples: 300 },
  OilPressure:      { yMin: 0,    yMax: 150,   yUnit: 'psi', windowSamples: 150 },
  OilTemp:          { yMin: 0,    yMax: 150,   yUnit: '°C',  windowSamples: 300 },
  FuelPressure:     { yMin: 0,    yMax: 100,   yUnit: 'psi', windowSamples: 150 },
  Lambda:           { yMin: 0.6,  yMax: 1.4,   yUnit: 'λ',   windowSamples: 150 },
  MAT:              { yMin: -10,  yMax: 80,    yUnit: '°C',  windowSamples: 300 },
  ShockPotFL:       { yMin: -30,  yMax: 30,    yUnit: 'mm',  windowSamples: 100 },
  ShockPotFR:       { yMin: -30,  yMax: 30,    yUnit: 'mm',  windowSamples: 100 },
  ShockPotRL:       { yMin: -30,  yMax: 30,    yUnit: 'mm',  windowSamples: 100 },
  ShockPotRR:       { yMin: -30,  yMax: 30,    yUnit: 'mm',  windowSamples: 100 },
};
