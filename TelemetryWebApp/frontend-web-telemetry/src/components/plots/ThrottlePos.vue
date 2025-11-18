<template>
  <div class="hello">
    <div id="scichart-throttle"></div>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch} from "vue";
import { useFileStoreStore } from "@/stores/FileStore";
import { chartSyncService } from "@/services/chartSync";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJSDarkTheme,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  RolloverModifier
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null; // To hold the chart surface instance
let throttleDataSeries: XyDataSeries | null = null; // To hold the data series

const timeData = computed(() => store.Time);  // Make reactive
const throttleData = computed(() => store.ThrottlePosition); // Make reactive

const updateChart = () => {
  if (!sciChartSurface || !throttleData) {
    return; // Chart hasn't been initialized yet
  }

  // Clear existing data points (or append if you want a continuous scrolling chart)
  throttleDataSeries.clear();

  //Append new data points
  for (let i = 0; i < timeData.value.length; i++) {
    throttleDataSeries.append(timeData.value[i], throttleData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-throttle", {
    theme: new SciChartJSDarkTheme(),
    title: "Throttle Position",
    titleStyle: { fontSize: 24 }
  });

  sciChartSurface = surface;
  throttleDataSeries = new XyDataSeries(wasmContext);

  // Renderable series
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
  stroke: "green",
  strokeThickness: 3,
  opacity: 1,
  dataSeries: throttleDataSeries,
  }));

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup })
  );

   // Axes
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));

  chartSyncService.register(sciChartSurface);

  updateChart();// Initial chart setup

  watch([timeData, throttleData], () => {
    updateChart();  // Update the chart when data changes
  });

});

onUnmounted(() => {
  if (sciChartSurface) {
    chartSyncService.unregister(sciChartSurface);
    sciChartSurface.delete();
    sciChartSurface = null;
  }
});

</script>

<style scoped>
#scichart-throttle {
  width: 100%;
  height: 240px;
}
</style>