import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

export const useFileStoreStore = defineStore('fileStore', () => {
    const LatAcc:Ref<number[]> = ref([])
    const LongAcc:Ref<number[]> = ref([])
    const EngineRPM:Ref<number[]> = ref([])
    const Time:Ref<number[]> = ref([])
    const GPSXPos:Ref<number[]> = ref([])
    const GPSYPos:Ref<number[]> = ref([])
    const GPSSpeed:Ref<number[]> = ref([])
    const FrBrakePressure:Ref<number[]> = ref([])
    const ReBrakePressure:Ref<number[]> = ref([])
    const ThrottlePosition:Ref<number[]> = ref([])
    const OilPressure:Ref<number[]> = ref([])
    const OilTemp:Ref<number[]> = ref([])
    const ExternalVoltage:Ref<number[]> = ref([])
    const MAP:Ref<number[]> = ref([])
    const MAT:Ref<number[]> = ref([])
    const SteeringAngle:Ref<number[]> = ref([])
    const FuelPressure:Ref<number[]> = ref([])
    const GearPos:Ref<number[]> = ref([])
    const Lambda:Ref<number[]> = ref([])
    const CoolantTemp:Ref<number[]> = ref([])
    const FRBrakeTemp:Ref<number[]> = ref([])
    const FLBrakeTemp:Ref<number[]> = ref([])
    const RRBrakeTemp:Ref<number[]> = ref([])
    const RLBrakeTemp:Ref<number[]> = ref([])

    const getLatAcc = computed(() => LatAcc.value)
    const getLongAcc = computed(() => LongAcc.value)
    const getEngineRPM = computed(() => EngineRPM.value)
    const getTime = computed(() => Time.value)
    const getGPSXPos = computed(() => GPSXPos.value)
    const getGPSYPos = computed(() => GPSYPos.value)
    const getGPSSpeed = computed(() => GPSSpeed.value)
    const getFrBrakePressure = computed(() => FrBrakePressure.value)
    const getReBrakePressure = computed(() => ReBrakePressure.value)
    const getThrottlePosition = computed(() => ThrottlePosition.value)
    const getOilPressure = computed(() => OilPressure.value)
    const getOilTemp = computed(() => OilTemp.value)
    const getExternalVoltage = computed(() => ExternalVoltage.value)
    const getMAP = computed(() => MAP.value)
    const getMAT = computed(() => MAT.value)
    const getSteeringAngle = computed(() => SteeringAngle.value)
    const getFuelPressure = computed(() => FuelPressure.value)
    const getGearPos = computed(() => GearPos.value)
    const getLambda = computed(() => Lambda.value)
    const getCoolantTemp = computed(() => CoolantTemp.value)
    const getFRBrakeTemp = computed(() => FRBrakeTemp.value)
    const getFLBrakeTemp = computed(() => FLBrakeTemp.value)
    const getRRBrakeTemp = computed(() => RRBrakeTemp.value)
    const getRLBrakeTemp = computed(() => RLBrakeTemp.value)

    async function updateCollectedData(
        LatAccIn: number[],
        LongAccIn: number[],
        EngineRPMIn: number[],
        TimeIn: number[],
        GPSXPosIn: number[],
        GPSYPosIn: number[],
        GPSSpeedIn: number[],
        FrBrakePressureIn: number[],
        ReBrakePressureIn: number[],
        ThrottlePositionIn: number[],
        OilPressureIn: number[],
        OilTempIn: number[],
        ExternalVoltageIn: number[],
        MAPIn: number[],
        MATIn: number[],
        SteeringAngleIn: number[],
        FuelPressureIn: number[],
        GearPosIn: number[],
        LambdaIn: number[],
        CoolantTempIn: number[],
        FRBrakeTempIn: number[],
        FLBrakeTempIn: number[],
        RRBrakeTempIn: number[],
        RLBrakeTempIn: number[]) {

        LatAcc.value = LatAccIn
        LongAcc.value = LongAccIn
        EngineRPM.value = EngineRPMIn
        Time.value = TimeIn
        GPSXPos.value = GPSXPosIn
        GPSYPos.value = GPSYPosIn
        GPSSpeed.value = GPSSpeedIn
        FrBrakePressure.value = FrBrakePressureIn
        ReBrakePressure.value = ReBrakePressureIn
        ThrottlePosition.value = ThrottlePositionIn
        OilPressure.value = OilPressureIn
        OilTemp.value = OilTempIn
        ExternalVoltage.value = ExternalVoltageIn
        MAP.value = MAPIn
        MAT.value = MATIn
        SteeringAngle.value = SteeringAngleIn
        FuelPressure.value = FuelPressureIn
        GearPos.value = GearPosIn
        Lambda.value = LambdaIn
        CoolantTemp.value = CoolantTempIn
        FRBrakeTemp.value = FRBrakeTempIn
        FLBrakeTemp.value = FLBrakeTempIn
        RRBrakeTemp.value = RRBrakeTempIn
        RLBrakeTemp.value = RLBrakeTempIn
        }

    // subscribe function
    const subscribe = (callback:
        (LatAccIn: number[],
            LongAccIn: number[],
            EngineRPMIn: number[],
            TimeIn: number[],
            GPSXPosIn: number[],
            GPSYPosIn: number[],
            GPSSpeedIn: number[],
            FrBrakePressureIn: number[],
            ReBrakePressureIn: number[],
            ThrottlePositionIn: number[],
            OilPressureIn: number[],
            OilTempIn: number[],
            ExternalVoltageIn: number[],
            MAPIn: number[],
            MATIn: number[],
            SteeringAngleIn: number[],
            FuelPressureIn: number[],
            GearPosIn: number[],
            LambdaIn: number[],
            CoolantTempIn: number[],
            FRBrakeTempIn: number[],
            FLBrakeTempIn: number[],
            RRBrakeTempIn: number[],
            RLBrakeTempIn: number[]) => void) => {
        const interval = setInterval(() => {
            callback(LatAcc.value,
                LongAcc.value,
                EngineRPM.value,
                Time.value,
                GPSXPos.value,
                GPSYPos.value,
                GPSSpeed.value,
                FrBrakePressure.value,
                ReBrakePressure.value,
                ThrottlePosition.value,
                OilPressure.value,
                OilTemp.value,
                ExternalVoltage.value,
                MAP.value,
                MAT.value,
                SteeringAngle.value,
                FuelPressure.value,
                GearPos.value,
                Lambda.value,
                CoolantTemp.value,
                FRBrakeTemp.value,
                FLBrakeTemp.value,
                RRBrakeTemp.value,
                RLBrakeTemp.value)
        }, 10)
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
        GPSSpeed,
        FrBrakePressure,
        ReBrakePressure,
        ThrottlePosition,
        OilPressure,
        OilTemp,
        ExternalVoltage,
        MAP,
        MAT,
        SteeringAngle,
        FuelPressure,
        GearPos,
        Lambda,
        CoolantTemp,
        FRBrakeTemp,
        FLBrakeTemp,
        RRBrakeTemp,
        RLBrakeTemp,
        updateCollectedData,
        getLatAcc,
        getLongAcc,
        getEngineRPM,
        getTime,
        getGPSXPos,
        getGPSYPos,
        getGPSSpeed,
        getFrBrakePressure,
        getReBrakePressure,
        getThrottlePosition,
        getOilPressure,
        getOilTemp,
        getExternalVoltage,
        getMAP,
        getMAT,
        getSteeringAngle,
        getFuelPressure,
        getGearPos,
        getLambda,
        getCoolantTemp,
        getFRBrakeTemp,
        getFLBrakeTemp,
        getRRBrakeTemp,
        getRLBrakeTemp
        }
});
