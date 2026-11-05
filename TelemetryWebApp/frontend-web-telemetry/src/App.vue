<template id="home">

<div class="flex justify-center w-full">
    <div class="navbar flex-wrap gap-x-2 gap-y-0 rounded-3xl border-amber-200 w-full md:w-5/6 m-3 sticky justify-center lg:justify-between">
      <a class="text-sm lg:text-2xl lg:pl-4 lg:shrink-0">WashU Racing Telemetry Display </a>
      <FileReader class="inline-block" />
      <StartStreamingButton />
      <!-- <ServerStatus /> -->
      <CarStatus />
      <FuelGauge compact />
      <div class="flex flex-nowrap md:flex-wrap justify-center w-full" id="section-wrapper" :class="{ 'tab-clicked': tabClicked }">
        <router-link class="btn btn-sm md:btn-md text-xs md:text-sm bg-yellow-600 mx-1 md:mx-2 mb-1" to="/" @click="tabClicked = true">Driver Inputs</router-link>
        <router-link class="btn btn-sm md:btn-md text-xs md:text-sm bg-red-900 mx-1 md:mx-2 mb-1" to="/powertrain" @click="tabClicked = true">Powertrain</router-link>
        <router-link class="btn btn-sm md:btn-md text-xs md:text-sm bg-blue-700 mx-1 md:mx-2 mb-1" to="/suspension" @click="tabClicked = true">Suspension</router-link>
      </div>
    </div>
</div>
  <router-view class="flex max-w-full"/>
</template>

<script setup lang="ts">
import FileReader from "./components/FileReader.vue";
import StartStreamingButton from "./components/StartStreamingButton.vue";
import CarStatus from "./components/CarStatus.vue";
import FuelGauge from "./components/FuelGauge.vue";
import { MemoryUsageHelper } from "scichart";
import { ref } from "vue";

// Tabs all start normal-colored; the current tab is only highlighted once one has been clicked
const tabClicked = ref(false);

// Useful for debugging Memory Leaks (set to false in prod)!
MemoryUsageHelper.isMemoryUsageDebugEnabled = false;
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  max-width: 100%;
  margin: 0;
}

/* Show the current page's tab in gray (only after a tab has been clicked) */
#section-wrapper.tab-clicked .router-link-exact-active {
  background-color: #4b5563; /* gray-600 */
  border-color: #4b5563;
}
</style>
