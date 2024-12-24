<template>
    <div class=" max-w-full text-center bg-green-800 text-green-50">
      Ergo
    </div>

  <div class="flex grid-cols-4 justify-evenly w-full" id="section-wrapper">
    <TrackMap class="w-96"/>
    <GGPlot class="w-96" msg="GG Plot" />
    <Voltage class="w-96" msg="Voltage" />
    <GearPosPlot />
  </div>
  <div class="flex flex-col">
    <div class="w-full h-1/2" >
      <ThrottlePos msg="Throttle Position" />
      <BrakePos />
      <EngineSpeed />
      <VehicleSpeed />
      <SteeringAngle />
    </div>
  </div>

</template>

<script setup>
import TrackMap from "@/components/TrackMap.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import VehicleSpeed from "@/components/plots/VehicleSpeed.vue";
import GGPlot from "@/components/plots/GGPlot.vue";
import BrakePos from "@/components/plots/BrakePos.vue";
import SteeringAngle from "@/components/plots/SteeringAngle.vue";
import Voltage from "@/components/plots/Voltage.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";

</script>

<style scoped>
/* Your style code here */
</style>
