<template>
    <div class=" max-w-full text-center bg-yellow-600 text-yellow-50">
        Race Engineer
    </div>

    <div class="flex grid-cols-4 justify-evenly w-full" id="section-wrapper">
      <TrackMap class="w-96"/>
      <GGPlot class="w-96" msg="GG Plot" />
      <Voltage class="w-96" msg="Voltage" />
      <GearPosPlot />
  </div>
  <div class="flex flex-col">
    <div class="flex items-center justify-between text-white p-4">
      <div class="w-full h-84" >
        <BrakePos msg="Brake Position" />
        <ThrottlePos msg="Throttle Position" />
        <SteeringAngle />
        <EngineSpeed />

      </div>
    </div>
  </div>
</template>

<script setup>
import TrackMap from "@/components/TrackMap.vue";
import BrakePos from "@/components/plots/BrakePos.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";
import SteeringAngle from "@/components/plots/SteeringAngle.vue";
import GGPlot from "@/components/plots/GGPlot.vue";
import Voltage from "@/components/plots/Voltage.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
</script>

<style scoped>
/* Your style code here */
</style>
