<template>
  <div class="hello">
    <div id="scichart-oilpressure"></div>
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
let oilPressureDataSeries: XyDataSeries | null = null; // To hold the data series

const timeData = computed(() => store.Time);
const oilPressureData = computed(() => store.OilPressure); 
let liveStatus = store.isLive;

const updateChart = () => {
  if (!sciChartSurface || !oilPressureDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  if (liveStatus) {
    let lb = oilPressureData.value.length - 1
    let lt = timeData.value.length - 1
    oilPressureDataSeries?.append(timeData.value[lt], oilPressureData.value[lb]);
  } else {
    oilPressureDataSeries?.clear();
    oilPressureDataSeries?.appendRange(timeData.value, oilPressureData.value);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-oilpressure", {
    theme: new SciChartJSDarkTheme(),
    title: "Oil Pressure",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;


  // Create the data series *once*
  oilPressureDataSeries = new XyDataSeries(wasmContext);

  // ... (add axes, renderable series, etc., as before, but *outside* the watch)
    // Renderable series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "orange",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: oilPressureDataSeries,
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
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false}));

  chartSyncService.register(sciChartSurface);

  updateChart();// Initial chart setup

  watch([timeData, oilPressureData], () => {
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
#scichart-oilpressure {
  width: 100%;
  height: 240px;
}
</style>
