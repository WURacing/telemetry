import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

// Uses the pipe (|) to delineate different possible types of "Telemetry Fields"
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

// Using hash maps for something that isn't leetcode
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

// For every field in telemetryFields, init that field as an empty array
// We use ref() so that charts can update upon receiving data
const createTelemetryState = (): TelemetryState => telemetryFields.reduce((acc, field) => {
  acc[field] = ref([])
  return acc
}, {} as TelemetryState)

export const useFileStoreStore = defineStore('fileStore', () => {
  const isLive = ref(false)
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

  const setLiveMode = (active: boolean) => {
    isLive.value = active
  }

  return {
    ...state,
    isLive,
    setLiveMode,
    updateCollectedData,
    clearCollectedData
  }
})
