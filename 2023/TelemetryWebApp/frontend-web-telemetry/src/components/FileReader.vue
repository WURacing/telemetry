<template>
  <div class="left-5 text-red-400 w-1/5 justify-start">
    <label class="text-red-100 p-4">
      <input type="file" id="input" name="input" accept=".csv" @change="loadTextFromFile" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-red-100 file:text-red-400
      hover:file:bg-red-200
      hover:file:ease-linear">
    </label>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import papaparse from 'papaparse';
import { useFileStoreStore } from '../stores/FileStore';

const store = useFileStoreStore();
const LatAcc:Ref<number[]> = ref([]);
const LongAcc:Ref<number[]> = ref([]);
const EngineRPM:Ref<number[]> = ref([]);
const Time:Ref<number[]> = ref([]);
const GPSXPos:Ref<number[]> = ref([]);
const GPSYPos:Ref<number[]> = ref([]);
const GPSSpeed:Ref<number[]> = ref([]);
const FrBrakePressure:Ref<number[]> = ref([]);
const ReBrakePressure:Ref<number[]> = ref([]);
const ThrottlePosition:Ref<number[]> = ref([]);
const OilPressure:Ref<number[]> = ref([]);
const OilTemp:Ref<number[]> = ref([]);
const ExternalVoltage:Ref<number[]> = ref([]);
const MAP:Ref<number[]> = ref([]);
const MAT:Ref<number[]> = ref([]);
const SteeringAngle:Ref<number[]> = ref([]);
const FuelPressure:Ref<number[]> = ref([]);
const GearPosition:Ref<number[]> = ref([]);
const Lambda:Ref<number[]> = ref([]);
const CoolantTemp:Ref<number[]> = ref([]);
const FrBrakeTemp:Ref<number[]> = ref([]);
const FLBrakeTemp:Ref<number[]> = ref([]);
const RRBrakeTemp:Ref<number[]> = ref([]);
const RLBrakeTemp:Ref<number[]> = ref([]);


function loadTextFromFile(ev: Event) {
  const file: File = (ev.target as HTMLInputElement).files![0];
  const parser = new FileReader();

  store.updateCollectedData([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);

  parser.readAsText(file);

  parser.onload = function (ev) {
    const text = ev.target!.result as string;
    const result = papaparse.parse(text, { header: true });

    console.log("CSV file: " + file.name);

    LatAcc.value = result.data.map((column: number[]) => column["GPS LatAcc"]);
    LongAcc.value = result.data.map((column: number[]) => column["GPS LonAcc"]);
    EngineRPM.value = result.data.map((column: number[]) => column["EngineSpeed"]);
    Time.value = result.data.map((column: number[]) => column["Time"]);
    GPSXPos.value = result.data.map((column: number[]) => column["GPS Latitude"]);
    GPSYPos.value = result.data.map((column: number[]) => column["GPS Longitude"]);
    GPSSpeed.value = result.data.map((column: number[]) => column["GPS Speed"]);
    FrBrakePressure.value = result.data.map((column: number[]) => column["FBrkPrs"]);
    ReBrakePressure.value = result.data.map((column: number[]) => column["RBrkPrs"]);
    ThrottlePosition.value = result.data.map((column: number[]) => column["ThrottlePosition"]);
    OilPressure.value = result.data.map((column: number[]) => column["OilPressure"]);
    OilTemp.value = result.data.map((column: number[]) => column["Oil Temp"]);
    ExternalVoltage.value = result.data.map((column: number[]) => column["External Voltage"]);
    MAP.value = result.data.map((column: number[]) => column["MAP"]);
    MAT.value = result.data.map((column: number[]) => column["FuelCompAirTemp"]);
    SteeringAngle.value = result.data.map((column: number[]) => column["SteeringPot"]);
    FuelPressure.value = result.data.map((column: number[]) => column["Fuel Press"]);
    GearPosition.value = result.data.map((column: number[]) => column["GearPosition"]);
    Lambda.value = result.data.map((column: number[]) => column["Lambda"]);
    CoolantTemp.value = result.data.map((column: number[]) => column["Coolant Temp"]);
    FrBrakeTemp.value = result.data.map((column: number[]) => column["FRTemp"]);
    FLBrakeTemp.value = result.data.map((column: number[]) => column["FLTemp"]);
    RRBrakeTemp.value = result.data.map((column: number[]) => column["RTemp"]);
    RLBrakeTemp.value = result.data.map((column: number[]) => column["RLBrakeTemp"]);


    store.updateCollectedData(
      LatAcc.value,
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
      GearPosition.value,
      CoolantTemp.value,
      Lambda.value,
      FrBrakeTemp.value,
      FLBrakeTemp.value,
      RRBrakeTemp.value,
      RLBrakeTemp.value);
      }
}

</script>

<style scoped>
/* Your style code here */
</style>
