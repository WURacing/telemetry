<template>
    <div class=" max-w-full text-center bg-red-800 text-red-50">
        Powertrain
    </div>

    <div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
      <TrackMap msg="Track Map" />
      <MAT />
    </div>
    <div class="w-full h-84" >
      <MAP />
      <CoolantTemp />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
    <Voltage />
      <OilTemp />
    </div>
    <div class="w-full h-1/2" >
      <FuelPressure />
      <OilPressure />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
      <GearPosPlot />
    </div>
    <div class="w-full h-1/2" >
      <EngineSpeed />
      <ThrottlePos msg="Throttle Position" />
      <Lambda />
    </div>
  </div>
</div>
</template>

<script setup>
import TrackMap from "@/components/TrackMap.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import Voltage from "@/components/plots/Voltage.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";
import MAP from "@/components/plots/MAP.vue";
import MAT from "@/components/plots/MAT.vue";
import Lambda from "@/components/plots/Lambda.vue";
import FuelPressure from "@/components/plots/FuelPressure.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
import OilTemp from "@/components/plots/OilTemp.vue";
import OilPressure from "@/components/plots/OilPressure.vue";
import CoolantTemp from "@/components/plots/CoolantTemp.vue";

</script>

<style scoped>
/* Your style code here */
</style>
