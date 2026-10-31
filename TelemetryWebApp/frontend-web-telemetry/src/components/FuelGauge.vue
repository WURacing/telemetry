<template>
  <!-- Compact version for the header bar -->
  <div v-if="compact" class="flex shrink-0 items-center gap-2 whitespace-nowrap px-3 text-xs text-white" :title="tooltip">
    <span class="font-semibold uppercase tracking-wide text-gray-300">Fuel</span>
    <div class="relative h-3 w-28 overflow-hidden rounded-full bg-gray-700">
      <div class="h-full transition-all duration-500" :class="barClass" :style="{ width: pct + '%' }"></div>
      <div class="marker" :style="{ left: yellowPct + '%' }"></div>
      <div class="marker" :style="{ left: redPct + '%' }"></div>
    </div>
    <span class="w-16 font-bold tabular-nums" :class="textClass">{{ leftText }}</span>
    <span v-if="badge" class="rounded px-1 text-[10px] font-bold" :class="badgeClass">{{ overTank ? 'RESET?' : badge }}</span>
  </div>

  <!-- Full version for the Powertrain view -->
  <div v-else class="rounded-lg bg-neutral-900 p-4 text-white" :title="tooltip">
    <div class="flex items-baseline justify-between">
      <span class="text-sm font-semibold uppercase tracking-wide text-gray-300">Fuel Left</span>
      <span v-if="badge" class="rounded px-2 py-0.5 text-xs font-bold" :class="badgeClass">{{ badge }}</span>
    </div>

    <div class="mt-1 text-5xl font-bold tabular-nums" :class="textClass">
      {{ leftText }}
      <span class="text-xl text-gray-400">{{ left === null ? '' : `/ ${tank.toFixed(1)} L` }}</span>
    </div>

    <div class="relative mt-3 h-6 overflow-hidden rounded-full bg-gray-700">
      <div class="h-full transition-all duration-500" :class="barClass" :style="{ width: pct + '%' }"></div>
      <div class="marker" :style="{ left: yellowPct + '%' }"></div>
      <div class="marker" :style="{ left: redPct + '%' }"></div>
      <span class="absolute inset-0 flex items-center justify-center text-sm font-bold drop-shadow">
        {{ left === null ? '' : pct.toFixed(0) + '%' }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-3 gap-2 whitespace-nowrap text-center">
      <div>
        <div class="text-[11px] uppercase text-gray-400">Used</div>
        <div class="text-base font-semibold tabular-nums">{{ used === null ? '—' : used.toFixed(2) + ' L' }}</div>
      </div>
      <div>
        <div class="text-[11px] uppercase text-gray-400">Burn Rate</div>
        <div class="text-base font-semibold tabular-nums">{{ avgRate === null ? '—' : avgRate.toFixed(1) + ' L/h' }}</div>
      </div>
      <div>
        <div class="text-[11px] uppercase text-gray-400">Time Left</div>
        <div class="text-base font-semibold tabular-nums">{{ minutesLeft === null ? '—' : minutesLeft.toFixed(0) + ' min' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Fuel left = tank size - fuel used since the meter was last reset (done at every fill-up).
// Thresholds live in services/fuelConfig.ts.
import { computed } from 'vue';
import { useFileStoreStore } from '../stores/FileStore';
import { fuelConfig, fuelZone, lastFinite } from '../services/fuelConfig';

defineProps<{ compact?: boolean }>();

const store = useFileStoreStore();
const tank = fuelConfig.TANK_LITERS;
const yellowPct = (fuelConfig.YELLOW_LITERS / tank) * 100;
const redPct = (fuelConfig.RED_LITERS / tank) * 100;

const used = computed(() => lastFinite(store.FuelUsed));
const left = computed(() => (used.value === null ? null : Math.max(0, tank - used.value)));
const pct = computed(() => (left.value === null ? 0 : Math.min(100, (left.value / tank) * 100)));
const zone = computed(() => fuelZone(left.value));

// More used than the tank holds: the meter almost certainly wasn't reset at the last fill-up.
const overTank = computed(() => used.value !== null && used.value > tank + 0.05);
const stale = computed(() => store.fuelValid === false);

// Average burn rate over the last RATE_AVG_SAMPLES samples, ignoring missing ones.
const avgRate = computed(() => {
  const recent = (store.FuelRate ?? []).slice(-fuelConfig.RATE_AVG_SAMPLES).filter(Number.isFinite);
  if (!recent.length) return null;
  return recent.reduce((a, b) => a + b, 0) / recent.length;
});

const minutesLeft = computed(() => {
  if (left.value === null || avgRate.value === null || avgRate.value < 0.1) return null;
  return (left.value / avgRate.value) * 60;
});

const leftText = computed(() => (left.value === null ? '—' : left.value.toFixed(2) + ' L'));

const badge = computed(() => {
  if (overTank.value) return 'RESET METER?';
  if (stale.value) return 'STALE';
  return '';
});

const barClass = computed(() => ({
  'bg-green-500': zone.value === 'green',
  'bg-yellow-400': zone.value === 'yellow',
  'bg-red-600 animate-pulse': zone.value === 'red',
}));

const textClass = computed(() => ({
  'text-gray-400': zone.value === 'none',
  'text-green-400': zone.value === 'green',
  'text-yellow-300': zone.value === 'yellow',
  'text-red-500': zone.value === 'red',
}));

const badgeClass = computed(() => (overTank.value ? 'bg-red-700 text-white' : 'bg-gray-600 text-gray-100'));

const tooltip = computed(() => {
  if (overTank.value) return `Meter shows ${used.value?.toFixed(2)} L used — more than the ${tank} L tank. Was it reset at the last fill-up?`;
  if (stale.value) return 'Car reports stale RPM/injector data — fuel total is held at the last good value.';
  if (left.value === null) return 'No fuel data received yet.';
  return `Yellow at ${fuelConfig.YELLOW_LITERS} L, red at ${fuelConfig.RED_LITERS} L left.`;
});
</script>

<style scoped>
.marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.6);
}
</style>
