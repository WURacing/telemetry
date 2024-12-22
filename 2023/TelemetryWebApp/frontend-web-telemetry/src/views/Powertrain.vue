<template>
    <div class=" max-w-full text-center bg-red-800 text-red-50">
        Home
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
<!--    <GGPlot msg="GG Plot" />-->
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
      <BrakePos msg="Brake Position" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-16 h-16 mr-4">
      <ThrottlePos msg="Throttle Position" />
    </div>
    <div class="w-full h-16 mr-4" >
      <Voltage />
      <EngineSpeed />
    </div>
  </div>
</div>



<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-16 h-16 mr-4"></div>
    <!-- Vue.js component for the fifth row -->
  </div>
</div>
</template>

<script setup>
import BrakePos from "@/components/BrakePos.vue";
import VehicleSpeed from "@/components/VehicleSpeed.vue";
import GGPlot from "@/components/GGPlot.vue";
import TrackMap from "@/components/TrackMap.vue";
import ThrottlePos from "@/components/ThrottlePos.vue";
import Voltage from "@/components/Voltage.vue";
import EngineSpeed from "@/components/EngineSpeed.vue";
</script>

<style scoped>
/* Your style code here */
</style>
