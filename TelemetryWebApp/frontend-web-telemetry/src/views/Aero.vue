<template>
    <div class=" max-w-full text-center bg-blue-800 text-blue-50">
        Aero
    </div>

    <div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
      <TrackMap msg="Track Map" />
    </div>
    <div class="w-full h-84" >
      <VehicleSpeed msg="Airspeed Plot" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
    <GGPlot />
    </div>
    <div class="w-full h-1/2" >
      <ThrottlePos msg="Throttle Position" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
<!--  Square plot here    -->
    </div>
    <div class="w-full h-1/2" >
      <GearPosPlot />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-16 h-16 mr-4">
      <ThrottlePos msg="Throttle Position" />
    </div>
    <div class="w-full h-16 mr-4" >
      <EngineSpeed />
    </div>
  </div>
</div>
</template>

<script setup>
import TrackMap from "@/components/TrackMap.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";
import VehicleSpeed from "@/components/plots/VehicleSpeed.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
import GGPlot from "@/components/plots/GGPlot.vue";

</script>

<style scoped>
/* Your style code here */
</style>
