<template id="home">

  <div class="flex justify-center w-full">
    <div class="navbar rounded-3xl border-amber-200 w-5/6 m-3 sticky justify-center">
      <a class="text-sm lg:text-2xl">WashU Racing Telemetry Display </a>
      <FileReader class="inline-block" />
      <StartStreamingButton />
<!--      <ServerStatus />-->
      <CarStatus />
      <div class="flex-wrap lg:flex-none text-right px-10" id="section-wrapper">
        <router-link class="btn bg-yellow-600 m-2" to="/">Driver Inputs</router-link>
        <router-link class="btn bg-red-900 m-2" to="/powertrain">Powertrain</router-link>
        <router-link class="btn bg-blue-700 m-2" to="/aero">Aero</router-link>
        <router-link class="btn bg-green-700 m-2" to="/ergo">Ergo</router-link>
      </div>
    </div>
</div>
  <router-view class="flex max-w-full"/>
</template>

<script setup lang="ts">
import FileReader from "./components/FileReader.vue";
import StartStreamingButton from "./components/StartStreamingButton.vue";
import CarStatus from "./components/CarStatus.vue";
import { MemoryUsageHelper } from "scichart";

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
</style>
