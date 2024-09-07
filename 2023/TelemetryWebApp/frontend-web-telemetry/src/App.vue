<template class="bg-base-100" id="home">



  <div>
    <a class="btn btn-ghost text-2xl">WashU Racing Telemetry Display </a>
    <FileReader class="inline-block" />
  </div>
  <div class="flex-right max-w-full text-right px-10" id="section-wrapper">
    <router-link class="text-red-600 m-3" to="/">Home</router-link>
    <router-link class="text-orange-400 m-3" to="/suspension">Race Engineer</router-link>
  </div>

  <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay">
  <router-view class="flex max-w-full"/>
  </label>
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
