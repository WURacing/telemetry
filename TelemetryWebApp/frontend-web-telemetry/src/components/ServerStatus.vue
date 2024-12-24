<template>
  <div
      class="rounded-lg px-4 py-2 text-white text-xs transition-colors duration-300"
      :class="isConnected ? 'bg-blue-500' : 'bg-blue-800'"
  >
    Server
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client';

const isConnected = ref(false)

const socket = io('http://localhost:4000', { transports: ['websocket'] });

onMounted(() => {
  // Listen for connect/disconnect events
  socket.on('connected', () => {
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    isConnected.value = false
  })
})

onUnmounted(() => {
  // Clean up listeners
  socket.off('connect')
  socket.off('disconnect')
})
</script>
