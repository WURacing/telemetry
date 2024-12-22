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
const AirSpeed:Ref<number[]> = ref([]);
const BrakePressure:Ref<number[]> = ref([]);
const ThrottlePosition:Ref<number[]> = ref([]);
const OilPressure:Ref<number[]> = ref([]);
const OilTemp:Ref<number[]> = ref([]);
const ExternalVoltage:Ref<number[]> = ref([]);

function loadTextFromFile(ev: Event) {
  const file: File = (ev.target as HTMLInputElement).files![0];
  const parser = new FileReader();

  store.updateCollectedData([], [], [], [], [], [], [], [], [], [], [], []);

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
    AirSpeed.value = result.data.map((column: number[]) => column["GPS Speed"]);
    BrakePressure.value = result.data.map((column: number[]) => column["FBrkPrs"]);
    ThrottlePosition.value = result.data.map((column: number[]) => column["ThrottlePosition"]);
    OilPressure.value = result.data.map((column: number[]) => column["OilPressure"]);
    OilTemp.value = result.data.map((column: number[]) => column["Oil Temp"]);
    ExternalVoltage.value = result.data.map((column: number[]) => column["External Voltage"]);

    store.updateCollectedData(
      LatAcc.value,
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
      ExternalVoltage.value);

      }
}

</script>

<style scoped>
/* Your style code here */
</style>
