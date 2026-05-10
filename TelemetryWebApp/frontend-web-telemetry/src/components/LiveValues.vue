<template>
  <div class="live-values">
    <div v-for="item in values" :key="item.label" class="value-card">
      <div class="value-label">{{ item.label }}</div>
      <div class="value-number">{{ item.display }}</div>
      <div class="value-unit">{{ item.unit }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFileStoreStore } from '../stores/FileStore';

const store = useFileStoreStore();

const smooth = (arr: number[], decimals = 1, n = 5): string => {
  if (!arr || arr.length === 0) return '—';
  const slice = arr.slice(-n);
  const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
  return avg.toFixed(decimals);
};

const values = computed(() => [
  { label: 'Coolant',   display: smooth(store.CoolantTemp),    unit: '°C'  },
  { label: 'Oil Temp',  display: smooth(store.OilTemp),        unit: '°C'  },
  { label: 'MAT',       display: smooth(store.MAT),            unit: '°C'  },
  { label: 'Oil Pres',  display: smooth(store.OilPressure),    unit: 'psi' },
  { label: 'Fuel Prs',  display: smooth(store.FuelPressure),   unit: 'psi' },
  { label: 'MAP',       display: smooth(store.MAP),            unit: 'kPa' },
  { label: 'Lambda',    display: smooth(store.Lambda, 3),      unit: 'λ'   },
  { label: 'Gear',      display: smooth(store.GearPos, 0),     unit: ''    },
]);
</script>

<style scoped>
.live-values {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
  background: #111;
  border-radius: 8px;
  width: 100%;
}

.value-card {
  background: #1e1e1e;
  border-radius: 6px;
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #333;
}

.value-label {
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.value-number {
  color: #f0c040;
  font-size: 26px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.value-unit {
  color: #666;
  font-size: 11px;
  margin-top: 2px;
}
</style>
