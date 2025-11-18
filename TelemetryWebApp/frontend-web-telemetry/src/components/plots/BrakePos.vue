<template>
  <div class="hello">
    <div id="scichart-brakes"></div>
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
let sciChartSurface: SciChartSurface | null = null;
let brakeDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const brakepressureData = computed(() => store.FrBrakePressure);

// When new data is added, this is run
const updateChart = () => {
  if (!sciChartSurface || !brakepressureData) {
    return; // Chart hasn't been initialized yet
  }

  brakeDataSeries.append();

  for (let i = 0; i < timeData.value.length; i++) {
    brakeDataSeries.append(timeData.value[i], brakepressureData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-brakes", {
    theme: new SciChartJSDarkTheme(),
    title: "Brake Pressure",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;

  brakeDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "red",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: brakeDataSeries,
  }));

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup })
  );

  chartSyncService.register(sciChartSurface);


  updateChart();

  watch([timeData, brakepressureData], () => {
    updateChart();
  })
});

onUnmounted(() => {
  if (sciChartSurface) {
    chartSyncService.unregister(sciChartSurface);
    sciChartSurface.delete();
    sciChartSurface = null;
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#scichart-brakes {
  width: 100%;
  height: 240px;
}
</style>
