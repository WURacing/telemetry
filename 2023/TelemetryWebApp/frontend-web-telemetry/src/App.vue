<template id="home">
  <div class="flex pt-1 flex-start align-baseline" id="header-wrapper">
    <h2 class="text-2xl inline-block p-5 ml-10 text-start text-red-600">WashU Racing Telemetry Display</h2>
    <FileReader class="inline-block" />
  </div>
  <div class="flex-right max-w-full text-right px-10" id="section-wrapper">
    <router-link class="text-red-600 m-3" to="/">Home</router-link>
    <router-link class="text-orange-400 m-3" to="/suspension">Race Engineer</router-link>
  </div>
  <router-view class="flex max-w-full"/>

</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import FileReader from "./components/FileReader.vue";
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