<template>
  <div class="hello">
    <div id="scichart-rpm"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch} from "vue";
import { useFileStoreStore } from "../../stores/FileStore";
import { chartSyncService } from "../../services/chartSync";
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
let rpmDataSeries: XyDataSeries | null = null; // To hold the data series

const timeData = computed(() => store.Time);  // Make reactive
const rpmData = computed(() => store.EngineRPM); // Make reactive

const updateChart = () => {
  if (!sciChartSurface || !rpmDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  // Clear existing data points (or append if you want a continuous scrolling chart)
  rpmDataSeries.clear();

  //Append new data points
  for (let i = 0; i < timeData.value.length; i++) {
    rpmDataSeries.append(timeData.value[i], rpmData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-rpm", {
    theme: new SciChartJSDarkTheme(),
    title: "RPM",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;


  // Create the data series *once*
  rpmDataSeries = new XyDataSeries(wasmContext);

  // ... (add axes, renderable series, etc., as before, but *outside* the watch)
    // Renderable series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "white",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: rpmDataSeries,
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

  watch([timeData, rpmData], () => {
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
#scichart-rpm {
  width: 100%;
  height: 240px;
}
</style>
