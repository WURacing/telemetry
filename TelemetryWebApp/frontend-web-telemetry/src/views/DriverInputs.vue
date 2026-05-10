<template>
  <div class="max-w-full text-center bg-yellow-600 text-yellow-50">
    Race Engineer
  </div>

  <div class="flex justify-evenly w-full items-start p-4 gap-4">
    <TrackMap class="w-96 shrink-0" />
    <GearPosPlot class="shrink-0" />
    <LiveValues class="flex-1 min-w-0" />
  </div>

  <div class="flex flex-col">
    <div class="flex items-center justify-between text-white p-4">
      <div class="w-full">
        <BrakePos msg="Brake Pressure" />
        <ThrottlePos msg="Throttle Position" />
        <SteeringAngle />
        <EngineSpeed />
      </div>
    </div>
  </div>
</template>

<script setup>
import TrackMap from "@/components/plots/TrackMap.vue";
import BrakePos from "@/components/plots/BrakePos.vue";
import ThrottlePos from "@/components/plots/ThrottlePos.vue";
import EngineSpeed from "@/components/plots/EngineSpeed.vue";
import SteeringAngle from "@/components/plots/SteeringAngle.vue";
import GearPosPlot from "@/components/plots/GearPosPlot.vue";
import LiveValues from "@/components/LiveValues.vue";
</script>
