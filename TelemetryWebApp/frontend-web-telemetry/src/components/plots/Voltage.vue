<template>
  <div class="voltage">
    <div id="scichart-voltage"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, watch, onMounted, onUnmounted} from "vue";
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
let voltageDataSeries: XyDataSeries | null = null;
const timeData = computed(() => store.Time);
const voltageData = computed(() => store.ExternalVoltage);

const updateChart = () => {
  if (!sciChartSurface || !voltageDataSeries) {
    return; // Chart hasn't been initialized yet
  }
  voltageDataSeries.clear();

  for (let i = 0; i < timeData.value.length; i++) {
    voltageDataSeries.append(timeData.value[i], voltageData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-voltage", {
    theme: new SciChartJSDarkTheme(),
    title: "Voltage",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;

  voltageDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "yellow",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: voltageDataSeries,
  }));

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false}));
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

  watch([timeData, voltageData], () => {
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
#scichart-voltage {
  width: 100%;
}
</style>
