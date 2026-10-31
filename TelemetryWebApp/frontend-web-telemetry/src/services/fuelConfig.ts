// Fuel tank and warning thresholds. Keep these in sync with the dash config.
// "Fuel left" = TANK_LITERS - fuel used since the meter was last reset,
// so the meter must be reset (hold the reset button 3 s, engine off) at every fill-up.
export const fuelConfig = {
  TANK_LITERS: 6.0,
  YELLOW_LITERS: 1.5,    // gauge turns yellow at or below this much fuel left
  RED_LITERS: 0.75,      // gauge turns red at or below this much fuel left
  RATE_AVG_SAMPLES: 150, // burn-rate average window for "minutes left" (150 samples = 30 s at 5 Hz)
};

export type FuelZone = 'none' | 'green' | 'yellow' | 'red';

export const fuelZone = (litersLeft: number | null): FuelZone => {
  if (litersLeft === null) return 'none';
  if (litersLeft <= fuelConfig.RED_LITERS) return 'red';
  if (litersLeft <= fuelConfig.YELLOW_LITERS) return 'yellow';
  return 'green';
};

// Latest finite value in a rolling array (NaN marks samples with no fuel data).
export const lastFinite = (arr: number[] | undefined): number | null => {
  if (!arr) return null;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (Number.isFinite(arr[i])) return arr[i];
  }
  return null;
};
