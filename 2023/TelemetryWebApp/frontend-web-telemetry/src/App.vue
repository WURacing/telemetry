<template class="bg-accent" id="home">

  <div class="flex justify-center w-full">
    <div class="navbar rounded-3xl border-amber-200 w-5/6 m-3 sticky justify-center">
      <a class="btn btn-ghost text-2xl">WashU Racing Telemetry Display </a>
      <FileReader class="inline-block" />
      <StartStreamingButton />
      <ServerStatus />
      <CarStatus />
      <div class="flex-none text-right px-10" id="section-wrapper">
        <router-link class="btn bg-red-900 m-3" to="/">Home</router-link>
        <router-link class="btn bg-orange-700 m-3" to="/suspension">Race Engineer</router-link>
        <router-link class="btn bg-blue-700 m-3" to="/suspension">Aero</router-link>
        <router-link class="btn bg-green-700 m-3" to="/">Powertrain</router-link>
      </div>
    </div>
</div>
  <router-view class="flex max-w-full"/>
</template>

<script setup lang="ts">
import FileReader from "./components/FileReader.vue";
import StartStreamingButton from "./components/StartStreamingButton.vue";
import CarStatus from "./components/CarStatus.vue";
import ServerStatus from "./components/ServerStatus.vue";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #191b1d;
  max-width: 100%;
  height: 100vh;
  margin: 0;
}
</style>
