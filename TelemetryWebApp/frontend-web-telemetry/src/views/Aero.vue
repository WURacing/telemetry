<template>
    <div class=" max-w-full text-center bg-blue-800 text-blue-50">
        Aero
    </div>

    <div class="flex flex-col">
  <div class="flex flex-col md:flex-row items-center justify-between text-white p-4 gap-4 md:gap-0">
    <div class="w-full md:w-72 h-240 bg-red-900 md:mr-4 md:shrink-0">
      <TrackMap msg="Track Map" />
    </div>
    <div class="w-full h-84" >
      <VehicleSpeed msg="Airspeed Plot" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex flex-col md:flex-row items-center justify-between text-white p-4 gap-4 md:gap-0">
    <div class="w-full md:w-72 h-240 bg-red-900 md:mr-4 md:shrink-0">
    <GGPlot />
    </div>
    <div class="w-full h-1/2" >
      <ThrottlePos msg="Throttle Position" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex flex-col md:flex-row items-center justify-between text-white p-4 gap-4 md:gap-0">
    <div class="w-full md:w-72 h-240 bg-red-900 md:mr-4 md:shrink-0">
<!--  Square plot here    -->
    </div>
    <div class="w-full h-1/2" >
      <GearPosPlot />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex flex-col md:flex-row items-center justify-between text-white p-4 gap-4 md:gap-0">
    <div class="w-full" >
      <EngineSpeed />
    </div>
  </div>
</div>
</template>

<script setup>
import TrackMap from "@/components/plots/TrackMap.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";
import VehicleSpeed from "@/components/plots/VehicleSpeed.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
import GGPlot from "@/components/plots/GGPlot.vue";

</script>