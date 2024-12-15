import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

interface RacingData {
    [key: string]: Ref<number[]>
}

type RacingDataKeys = keyof RacingData

export const useFileStoreStore = defineStore('fileStore', () => {
    const RacingDate: RacingData = {
        LatAcc: ref([]),
        LongAcc: ref([]),
        EngineRPM: ref([]),
        Time: ref([]),
        GPSXPos: ref([]),
        GPSYPos: ref([])
    }

    const getLatAcc = computed(() => RacingDate.LatAcc.value)
    const getLongAcc = computed(() => RacingDate.LongAcc.value)
    const getEngineRPM = computed(() => RacingDate.EngineRPM.value)
    const getTime = computed(() => RacingDate.Time.value)
    const getGPSXPos = computed(() => RacingDate.GPSXPos.value)
    const getGPSYPos = computed(() => RacingDate.GPSYPos.value)

    async function updateCollectedData(
        LatAccIn: number[],
        LongAccIn: number[],
        EngineRPMIn: number[], 
        TimeIn: number[], 
        GPSXPosIn: number[], 
        GPSYPosIn: number[]) {
        RacingDate.LatAcc.value = LatAccIn
        RacingDate.LongAcc.value = LongAccIn
        RacingDate.EngineRPM.value = EngineRPMIn
        RacingDate.Time.value = TimeIn
        RacingDate.GPSXPos.value = GPSXPosIn
        RacingDate.GPSYPos.value = GPSYPosIn
    }

    return { 
        RacingDate,
        updateCollectedData, 
        getLatAcc, 
        getLongAcc, 
        getEngineRPM, 
        getTime, 
        getGPSXPos, 
        getGPSYPos
    }
});