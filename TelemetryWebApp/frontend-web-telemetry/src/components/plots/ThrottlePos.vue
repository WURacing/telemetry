<template>
  <div class="throttle">
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
  SciChartDefaults,
  MemoryUsageHelper,
  MouseWheelZoomModifier,
  RolloverModifier
} from "scichart";

SciChartSurface.wasmContextDisposeTimeout = 100; // default 0 mlliseconds
// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null;
let throttleDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const throttleposData = computed(() => store.ThrottlePosition);

const updateChart = () => {
  if (!sciChartSurface || !throttleDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  throttleDataSeries.clear();

  for (let i = 0; i < timeData.value.length; i++) {
    throttleDataSeries.append(timeData.value[i], throttleposData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  // Enables Data Resampling to conserve memory
  SciChartDefaults.enableResampling = false;

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-throttle", {
    theme: new SciChartJSDarkTheme(),
    title: "Throttle Position",
    titleStyle: { fontSize: 24 }
  });

  sciChartSurface = surface;
  throttleDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "green",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: throttleDataSeries,
  }));

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false}));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "%", autoRange: EAutoRange.Always}));

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup })
  );

  chartSyncService.register(sciChartSurface);


  updateChart();

  watch([timeData, throttleposData], () => {
    updateChart();
  })
});

onUnmounted(() => {
  if (sciChartSurface) {
    chartSyncService.unregister(sciChartSurface);
    sciChartSurface.delete();
    sciChartSurface = null;
  }
  SciChartSurface.disposeSharedWasmContext();
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#scichart-throttle {
  width: 100%;
  height: 240px;
}
</style>
