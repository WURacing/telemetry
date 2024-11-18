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
    <GGPlot msg="GG Plot" />
    </div>
    <div class="w-full h-1/2" >
      <ThrottlePos msg="Throttle Position" />
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="flex items-center justify-between text-white p-4">
    <div class="w-72 h-240 bg-red-900 mr-4">
<!--  Something will go in here    -->
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
    <div class="w-full h-1/4" >
      <OilPressure msg="Oil Pressure" />
      <OilTemp msg="Oil Temp" />
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
import BrakePos from "../components/BrakePos.vue";
import VehicleSpeed from "../components/VehicleSpeed.vue";
import GGPlot from "/src/components/GGPlot.vue";
import TrackMap from "/src/components/TrackMap.vue";
import ThrottlePos from "/src/components/ThrottlePos.vue";
import OilPressure from "/src/components/OilPressure.vue";
import OilTemp from "/src/components/OilTemp.vue";
</script>

<style scoped>
/* Your style code here */
</style>
