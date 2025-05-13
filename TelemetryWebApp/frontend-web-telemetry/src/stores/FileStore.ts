import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

export const useFileStoreStore = defineStore('fileStore', () => {
    // Signals from DBC file
    const FrBrakePressure:Ref<number[]> = ref([])
    const SteeringAngle:Ref<number[]> = ref([])
    const FRBrakeTemp:Ref<number[]> = ref([])
    const FLBrakeTemp:Ref<number[]> = ref([])
    const Pitot:Ref<number[]> = ref([])
    const FrAccX:Ref<number[]> = ref([])
    const FrAccY:Ref<number[]> = ref([])
    const FrAccZ:Ref<number[]> = ref([])
    const FrGyroX:Ref<number[]> = ref([])
    const FrGyroY:Ref<number[]> = ref([])
    const FrGyroZ:Ref<number[]> = ref([])
    const FrMagX:Ref<number[]> = ref([])
    const FrMagY:Ref<number[]> = ref([])
    const ShockPotRL:Ref<number[]> = ref([])
    const RLBrakeTemp:Ref<number[]> = ref([])
    const RRBrakeTemp:Ref<number[]> = ref([])
    const ReBrakePressure:Ref<number[]> = ref([])
    const LatAcc:Ref<number[]> = ref([]) // RAccX from DBC
    const LongAcc:Ref<number[]> = ref([]) // RAccY from DBC
    const RearAccZ:Ref<number[]> = ref([])
    const RearGyroX:Ref<number[]> = ref([])
    const RearGyroY:Ref<number[]> = ref([])
    const RearGyroZ:Ref<number[]> = ref([])
    const RearMagX:Ref<number[]> = ref([])
    const RearMagY:Ref<number[]> = ref([])
    const ClutchPosition:Ref<number[]> = ref([])
    const ClutchL:Ref<number[]> = ref([])
    const ClutchR:Ref<number[]> = ref([])

    // Client-generated timestamp
    const Time:Ref<number[]> = ref([])


    const getFrBrakePressure = computed(() => FrBrakePressure.value)
    const getSteeringAngle = computed(() => SteeringAngle.value)
    const getFRBrakeTemp = computed(() => FRBrakeTemp.value)
    const getFLBrakeTemp = computed(() => FLBrakeTemp.value)
    const getPitot = computed(() => Pitot.value)
    const getFrAccX = computed(() => FrAccX.value)
    const getFrAccY = computed(() => FrAccY.value)
    const getFrAccZ = computed(() => FrAccZ.value)
    const getFrGyroX = computed(() => FrGyroX.value)
    const getFrGyroY = computed(() => FrGyroY.value)
    const getFrGyroZ = computed(() => FrGyroZ.value)
    const getFrMagX = computed(() => FrMagX.value)
    const getFrMagY = computed(() => FrMagY.value)
    const getShockPotRL = computed(() => ShockPotRL.value)
    const getRLBrakeTemp = computed(() => RLBrakeTemp.value)
    const getRRBrakeTemp = computed(() => RRBrakeTemp.value)
    const getReBrakePressure = computed(() => ReBrakePressure.value)
    const getLatAcc = computed(() => LatAcc.value)
    const getLongAcc = computed(() => LongAcc.value)
    const getRearAccZ = computed(() => RearAccZ.value)
    const getRearGyroX = computed(() => RearGyroX.value)
    const getRearGyroY = computed(() => RearGyroY.value)
    const getRearGyroZ = computed(() => RearGyroZ.value)
    const getRearMagX = computed(() => RearMagX.value)
    const getRearMagY = computed(() => RearMagY.value)
    const getClutchPosition = computed(() => ClutchPosition.value)
    const getClutchL = computed(() => ClutchL.value)
    const getClutchR = computed(() => ClutchR.value)
    const getTime = computed(() => Time.value)

    async function updateCollectedData(
        FrBrakePressureIn: number[],
        SteeringAngleIn: number[],
        FRBrakeTempIn: number[],
        FLBrakeTempIn: number[],
        PitotIn: number[],
        FrAccXIn: number[],
        FrAccYIn: number[],
        FrAccZIn: number[],
        FrGyroXIn: number[],
        FrGyroYIn: number[],
        FrGyroZIn: number[],
        FrMagXIn: number[],
        FrMagYIn: number[],
        ShockPotRLIn: number[],
        RLBrakeTempIn: number[],
        RRBrakeTempIn: number[],
        ReBrakePressureIn: number[],
        LatAccIn: number[],
        LongAccIn: number[],
        RearAccZIn: number[],
        RearGyroXIn: number[],
        RearGyroYIn: number[],
        RearGyroZIn: number[],
        RearMagXIn: number[],
        RearMagYIn: number[],
        ClutchPositionIn: number[],
        ClutchLIn: number[],
        ClutchRIn: number[],
        TimeIn: number[]
        ) {

        FrBrakePressure.value = FrBrakePressureIn
        SteeringAngle.value = SteeringAngleIn
        FRBrakeTemp.value = FRBrakeTempIn
        FLBrakeTemp.value = FLBrakeTempIn
        Pitot.value = PitotIn
        FrAccX.value = FrAccXIn
        FrAccY.value = FrAccYIn
        FrAccZ.value = FrAccZIn
        FrGyroX.value = FrGyroXIn
        FrGyroY.value = FrGyroYIn
        FrGyroZ.value = FrGyroZIn
        FrMagX.value = FrMagXIn
        FrMagY.value = FrMagYIn
        ShockPotRL.value = ShockPotRLIn
        RLBrakeTemp.value = RLBrakeTempIn
        RRBrakeTemp.value = RRBrakeTempIn
        ReBrakePressure.value = ReBrakePressureIn
        LatAcc.value = LatAccIn
        LongAcc.value = LongAccIn
        RearAccZ.value = RearAccZIn
        RearGyroX.value = RearGyroXIn
        RearGyroY.value = RearGyroYIn
        RearGyroZ.value = RearGyroZIn
        RearMagX.value = RearMagXIn
        RearMagY.value = RearMagYIn
        ClutchPosition.value = ClutchPositionIn
        ClutchL.value = ClutchLIn
        ClutchR.value = ClutchRIn
        Time.value = TimeIn
        }

    // subscribe function
    const subscribe = (callback:
        (
            FrBrakePressureIn: number[],
            SteeringAngleIn: number[],
            FRBrakeTempIn: number[],
            FLBrakeTempIn: number[],
            PitotIn: number[],
            FrAccXIn: number[],
            FrAccYIn: number[],
            FrAccZIn: number[],
            FrGyroXIn: number[],
            FrGyroYIn: number[],
            FrGyroZIn: number[],
            FrMagXIn: number[],
            FrMagYIn: number[],
            ShockPotRLIn: number[],
            RLBrakeTempIn: number[],
            RRBrakeTempIn: number[],
            ReBrakePressureIn: number[],
            LatAccIn: number[],
            LongAccIn: number[],
            RearAccZIn: number[],
            RearGyroXIn: number[],
            RearGyroYIn: number[],
            RearGyroZIn: number[],
            RearMagXIn: number[],
            RearMagYIn: number[],
            ClutchPositionIn: number[],
            ClutchLIn: number[],
            ClutchRIn: number[],
            TimeIn: number[]
        ) => void) => {
        const interval = setInterval(() => {
            callback(
                FrBrakePressure.value,
                SteeringAngle.value,
                FRBrakeTemp.value,
                FLBrakeTemp.value,
                Pitot.value,
                FrAccX.value,
                FrAccY.value,
                FrAccZ.value,
                FrGyroX.value,
                FrGyroY.value,
                FrGyroZ.value,
                FrMagX.value,
                FrMagY.value,
                ShockPotRL.value,
                RLBrakeTemp.value,
                RRBrakeTemp.value,
                ReBrakePressure.value,
                LatAcc.value,
                LongAcc.value,
                RearAccZ.value,
                RearGyroX.value,
                RearGyroY.value,
                RearGyroZ.value,
                RearMagX.value,
                RearMagY.value,
                ClutchPosition.value,
                ClutchL.value,
                ClutchR.value,
                Time.value
                )
        }, 10)
        return () => clearInterval(interval)
    }

    return {
        subscribe,
        FrBrakePressure,
        SteeringAngle,
        FRBrakeTemp,
        FLBrakeTemp,
        Pitot,
        FrAccX,
        FrAccY,
        FrAccZ,
        FrGyroX,
        FrGyroY,
        FrGyroZ,
        FrMagX,
        FrMagY,
        ShockPotRL,
        RLBrakeTemp,
        RRBrakeTemp,
        ReBrakePressure,
        LatAcc,
        LongAcc,
        RearAccZ,
        RearGyroX,
        RearGyroY,
        RearGyroZ,
        RearMagX,
        RearMagY,
        ClutchPosition,
        ClutchL,
        ClutchR,
        Time,
        updateCollectedData,
        getFrBrakePressure,
        getSteeringAngle,
        getFRBrakeTemp,
        getFLBrakeTemp,
        getPitot,
        getFrAccX,
        getFrAccY,
        getFrAccZ,
        getFrGyroX,
        getFrGyroY,
        getFrGyroZ,
        getFrMagX,
        getFrMagY,
        getShockPotRL,
        getRLBrakeTemp,
        getRRBrakeTemp,
        getReBrakePressure,
        getLatAcc,
        getLongAcc,
        getRearAccZ,
        getRearGyroX,
        getRearGyroY,
        getRearGyroZ,
        getRearMagX,
        getRearMagY,
        getClutchPosition,
        getClutchL,
        getClutchR,
        getTime
        }
});
