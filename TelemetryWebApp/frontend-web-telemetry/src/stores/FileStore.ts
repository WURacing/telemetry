import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

// Keys the UI cares about. Keep the naming in sync with component usage.
export type TelemetryField =
  | 'Time'
  | 'LatAcc'
  | 'LongAcc'
  | 'GPSSpeed'
  | 'GPSXPos'
  | 'GPSYPos'
  | 'EngineRPM'
  | 'ThrottlePosition'
  | 'FrBrakePressure'
  | 'FuelPressure'
  | 'OilPressure'
  | 'OilTemp'
  | 'ExternalVoltage'
  | 'MAP'
  | 'MAT'
  | 'SteeringAngle'
  | 'GearPos'
  | 'Lambda'
  | 'CoolantTemp'

type TelemetryState = Record<TelemetryField, Ref<number[]>>

type TelemetryPayload = Partial<Record<TelemetryField, number[]>>

const telemetryFields: TelemetryField[] = [
  'Time',
  'LatAcc',
  'LongAcc',
  'GPSSpeed',
  'GPSXPos',
  'GPSYPos',
  'EngineRPM',
  'ThrottlePosition',
  'FrBrakePressure',
  'FuelPressure',
  'OilPressure',
  'OilTemp',
  'ExternalVoltage',
  'MAP',
  'MAT',
  'SteeringAngle',
  'GearPos',
  'Lambda',
  'CoolantTemp'
]

const createTelemetryState = (): TelemetryState => telemetryFields.reduce((acc, field) => {
  acc[field] = ref([])
  return acc
}, {} as TelemetryState)

export const useFileStoreStore = defineStore('fileStore', () => {
  const state = createTelemetryState()

  const applyPayload = (payload: TelemetryPayload) => {
    (Object.entries(payload) as [TelemetryField, number[]][]).forEach(([field, data]) => {
      state[field].value = Array.isArray(data) ? data : []
    })
  }

  const updateCollectedData = (payload: TelemetryPayload) => {
    applyPayload(payload)
  }

  const clearCollectedData = () => {
    const emptyPayload = telemetryFields.reduce<TelemetryPayload>((acc, field) => {
      acc[field] = []
      return acc
    }, {})
    applyPayload(emptyPayload)
  }

  return {
    ...state,
    updateCollectedData,
    clearCollectedData
  }
})
