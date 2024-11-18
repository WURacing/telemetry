<template>
    <div class=" max-w-full text-center bg-yellow-600 text-yellow-50">
        Race Engineer View
    </div>

    <div class="grid-cols-5 w-full" id="section-wrapper">
      <TrackMap class="w-96" msg="Track Map" />
      <ScichartGGPlot class="w-96" msg="GG Plot" />
      <BrakePressure class="w-96" msg="Brake Pressure" />
      <Voltage class="w-96" msg="Voltage" />
  </div>
</template>

<script setup>
import ScichartGGPlot from "/src/components/GGPlot.vue";
import TrackMap from "/src/components/TrackMap.vue";
import Voltage from "@/components/Voltage.vue";
</script>

<style scoped>
/* Your style code here */
</style>
