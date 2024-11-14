import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

export const useFileStoreStore = defineStore('fileStore', () => {
    const LatAcc:Ref<number[]> = ref([])
    const LongAcc:Ref<number[]> = ref([])
    const EngineRPM:Ref<number[]> = ref([])
    const Time:Ref<number[]> = ref([])
    const GPSXPos:Ref<number[]> = ref([])
    const GPSYPos:Ref<number[]> = ref([])
    const AirSpeed:Ref<number[]> = ref([])
    const BrakePressure:Ref<number[]> = ref([])
    const ThrottlePosition:Ref<number[]> = ref([])
    const OilPressure:Ref<number[]> = ref([])
    const OilTemp:Ref<number[]> = ref([])
    const ExternalVoltage:Ref<number[]> = ref([])

    const getLatAcc = computed(() => LatAcc.value)
    const getLongAcc = computed(() => LongAcc.value)
    const getEngineRPM = computed(() => EngineRPM.value)
    const getTime = computed(() => Time.value)
    const getGPSXPos = computed(() => GPSXPos.value)
    const getGPSYPos = computed(() => GPSYPos.value)
    const getAirSpeed = computed(() => AirSpeed.value)
    const getBrakePressure = computed(() => BrakePressure.value)
    const getThrottlePosition = computed(() => ThrottlePosition.value)
    const getOilPressure = computed(() => OilPressure.value)
    const getOilTemp = computed(() => OilTemp.value)
    const getExternalVoltage = computed(() => ExternalVoltage.value)

    async function updateCollectedData(
        LatAccIn: number[],
        LongAccIn: number[],
        EngineRPMIn: number[],
        TimeIn: number[],
        GPSXPosIn: number[],
        GPSYPosIn: number[],
        AirSpeedIn: number[],
        BrakePressureIn: number[],
        ThrottlePositionIn: number[],
        OilPressureIn: number[],
        OilTempIn: number[],
        ExternalVoltageIn: number[]){

        LatAcc.value = LatAccIn
        LongAcc.value = LongAccIn
        EngineRPM.value = EngineRPMIn
        Time.value = TimeIn
        GPSXPos.value = GPSXPosIn
        GPSYPos.value = GPSYPosIn
        AirSpeed.value = AirSpeedIn
        BrakePressure.value = BrakePressureIn
        ThrottlePosition.value = ThrottlePositionIn
        OilPressure.value = OilPressureIn
        OilTemp.value = OilTempIn
        ExternalVoltage.value = ExternalVoltageIn
        }

    // subscribe function
    const subscribe = (callback:
        (LatAccIn: number[],
            LongAccIn: number[],
            EngineRPMIn: number[],
            TimeIn: number[],
            GPSXPosIn: number[],
            GPSYPosIn: number[],
            AirSpeedIn: number[],
            BrakePressureIn: number[],
            ThrottlePositionIn: number[],
            OilPressureIn: number[],
            OilTempIn: number[],
            ExternalVoltageIn: number[]) => void) => {
        const interval = setInterval(() => {
            callback(LatAcc.value,
                LongAcc.value,
                EngineRPM.value,
                Time.value,
                 GPSXPos.value,
                 GPSYPos.value,
                 AirSpeed.value,
                 BrakePressure.value,
                 ThrottlePosition.value,
                 OilPressure.value,
                 OilTemp.value,
                 ExternalVoltage.value)
        }, 1000)
        return () => clearInterval(interval)
    }

    return {
        subscribe,
        LatAcc,
        LongAcc,
        EngineRPM,
        Time,
        GPSXPos,
        GPSYPos,
        AirSpeed,
        BrakePressure,
        ThrottlePosition,
        OilPressure,
        OilTemp,
        ExternalVoltage,
        updateCollectedData,
        getLatAcc,
        getLongAcc,
        getEngineRPM,
        getTime,
        getGPSXPos,
        getGPSYPos,
        getAirSpeed,
        getBrakePressure,
        getThrottlePosition,
        getOilPressure,
        getOilTemp,
        getExternalVoltage
        }
});
