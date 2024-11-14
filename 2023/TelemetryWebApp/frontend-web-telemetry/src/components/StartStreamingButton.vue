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
import { ref, computed, onUnmounted, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
import { wsService } from '../services/websocketService';
import { useFileStoreStore } from '../stores/FileStore';
import type { TelemetryData, TelemetryMetrics } from '../types/telemetry';

const store = useFileStoreStore();
const isConnected = ref(false);
const isLoading = ref(false);
const connectionError = ref<string | null>(null);
const metrics = ref<TelemetryMetrics>({
  queueSize: 0,
  droppedMessages: 0,
  processInterval: 16,
  isProcessing: false
});

// const fetchLatestTelemetryData = async () => {
//   try {
//     const response = await     Socket.call('telemetry');
//     if (response.data) {
//       const data: TelemetryData = response.data;
//       await store.updateCollectedData(
//           [...store.LatAcc, data.channels[0]].slice(-100),
//           [...store.LongAcc, data.channels[1]].slice(-100),
//           [...store.EngineRPM, data.channels[2]].slice(-100),
//           [...store.Time, Date.now()].slice(-100),
//           [...store.GPSXPos, data.channels[3]].slice(-100),
//           [...store.GPSYPos, data.channels[4]].slice(-100),
//           [...store.AirSpeed, data.channels[5]].slice(-100),
//           [...store.BrakePressure, data.channels[6]].slice(-100),
//           [...store.ThrottlePosition, data.channels[7]].slice(-100),
//           [...store.OilPressure, data.channels[8]].slice(-100),
//           [...store.OilTemp, data.channels[9]].slice(-100),
//           [...store.ExternalVoltage, data.channels[10]].slice(-100)
//       );
//     }
//   } catch (error) {
//     console.error('Error fetching telemetry data:', error);
//   }
// };

// Call the fetchLatestTelemetryData function periodically
let fetchInterval = null
// const startFetchingData = () => {
//     fetchInterval = setInterval(fetchLatestTelemetryData, 1000); // Fetch data every 1 second
// };

const stopFetchingData = () => {
  if (fetchInterval !== null) {
    clearInterval(fetchInterval);
    fetchInterval = null;
  }
};



// Update metrics periodically when connected
let metricsInterval: number | null = null;

const startMetricsMonitoring = () => {
  metricsInterval = window.setInterval(() => {
    metrics.value = wsService.getMetrics();
  }, 1000);
};

const stopMetricsMonitoring = () => {
  if (metricsInterval !== null) {
    clearInterval(metricsInterval);
    metricsInterval = null;
  }
};

const connect = async () => {
  try {
    isLoading.value = true;
    connectionError.value = null;


    // Connect to WebSocket server
    wsService.connect();

    // Start monitoring metrics
    startMetricsMonitoring();

    isConnected.value = true;
  } catch (error) {
    connectionError.value = error instanceof Error ? error.message : 'Failed to connect';
    console.error('Connection error:', error);
  } finally {
    isLoading.value = false;
  }
};

const disconnect = () => {
  wsService.disconnect();
  stopMetricsMonitoring();
  isConnected.value = false;
  connectionError.value = null;

  // Clear store data
  store.updateCollectedData(
      [], [], [], [], [], [], [], [], [], [], [],[]
  );
};

const toggleConnection = async () => {
  if (isConnected.value) {
    disconnect();
  } else {
    await connect();
  }
};

watch(
    () => isConnected.value,
    (connected) => {
      if (connected) {
        startFetchingData();
      } else {
        stopFetchingData();
      }
    }
);

// Cleanup on component unmount
onUnmounted(() => {
  disconnect();
});
</script>

<style />
