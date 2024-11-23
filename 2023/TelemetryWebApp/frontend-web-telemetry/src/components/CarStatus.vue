// CarStatus.vue
<template>
  <div
      class="rounded-lg px-4 py-2 text-white transition-colors duration-300"
      :class="isCarConnected ? 'bg-green-400' : 'bg-green-800'"
  >
    Car
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WebSocketService} from "../services/websocketService";
import { io, Socket } from 'socket.io-client';

const isCarConnected = ref(false)
const wsService = WebSocketService
let timeoutId: any | undefined

const socket = io('http://localhost:4000', { transports: ['websocket'] });

const resetTimer = () => {
  isCarConnected.value = true

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    isCarConnected.value = false
  }, 1000)
}

onMounted(() => {
  // Listen for telemetry updates
  socket.on('telemetry_update', () => {
    resetTimer()
  })
})

onUnmounted(() => {
  // Clean up
  socket.off('telemetry_update')
  if (timeoutId) {
    isCarConnected.value = false
    clearTimeout(timeoutId)
  }
})
</script>
