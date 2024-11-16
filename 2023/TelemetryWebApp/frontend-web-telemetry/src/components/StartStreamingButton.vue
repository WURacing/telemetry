<template>
  <div class="left-5 text-red-400 w-1/5 justify-start">
    <label class="text-red-100 p-4">
      <button id="input" @click="toggleConnection" class="block w-full text-sm
      mr-4 py-2 px-4
      rounded-full border-0
      font-semibold
      bg-green-950 text-yellow-600
      hover:bg-yellow-900
      hover:ease-linear">
        Begin Streaming Session
      </button>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useFileStoreStore } from '../stores/FileStore';
import { WebSocketService } from '../services/websocketService';

const store = useFileStoreStore();
const isConnected = ref(false);
const isLoading = ref(false);
const connectionError = ref<string | null>(null);

const wsService = new WebSocketService();

const connect = async () => {
  if (isConnected.value) return; // Already connected

  try {
    isLoading.value = true;
    connectionError.value = null;

    wsService.connect(); // The service handles the connection and data updates

    isConnected.value = true;
  } catch (error) {
    connectionError.value = error instanceof Error ? error.message : 'Failed to connect';
    console.error('Connection error:', error);
  } finally {
    isLoading.value = false;
  }
};

const disconnect = () => {
  if (!isConnected.value) return;

  wsService.disconnect();
  isConnected.value = false;
  connectionError.value = null;

  // Clear store data (if needed – clearing on disconnect is often appropriate)
  store.updateCollectedData([], [], [], [], [], [], [], [], [], [], [], []);
};

const toggleConnection = async () => {
  isConnected.value ? disconnect() : await connect();
};

// Cleanup on component unmount
onUnmounted(() => {
  disconnect();
});
</script>

<style />
