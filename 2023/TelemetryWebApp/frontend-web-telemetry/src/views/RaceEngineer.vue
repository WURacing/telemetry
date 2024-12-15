<template>
    <div class=" max-w-full text-center bg-yellow-600 text-yellow-50">
        Race Engineer View
    </div>

    <div class="grid-cols-5 w-full" id="section-wrapper">
      <TrackMap class="w-96" msg="Track Map" />
<!--      <GGPlot class="w-96" msg="GG Plot" />-->
      <BrakePos msg="Brake Position" />
      <ThrottlePos msg="Throttle Position" />
      <ScichartGGPlot class="w-96" msg="GG Plot" />
      <Voltage class="w-96" msg="Voltage" />
  </div>
</template>

<script setup>
import ScichartGGPlot from "@/components/GGPlot.vue";
import TrackMap from "@/components/TrackMap.vue";
import Voltage from "@/components/Voltage.vue";
import BrakePos from "@/components/BrakePos.vue";
import ThrottlePos from "@/components/ThrottlePos.vue";
import GGPlot from "@/components/GGPlot.vue";
</script>

<style scoped>
/* Your style code here */
</style>
