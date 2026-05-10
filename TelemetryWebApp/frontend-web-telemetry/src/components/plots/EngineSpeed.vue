<template>
  <div class="hello">
    <div id="scichart-fuelpressure"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useFileStoreStore } from "../../stores/FileStore";
import { chartSyncService } from "../../services/chartSync";
import { channelConfig } from "../../services/channelConfig";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  NumberRange,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJSDarkTheme,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  RolloverModifier
} from "scichart";

const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null;
let fuelPressureDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const fuelPressureData = computed(() => store.FuelPressure);

const updateChart = () => {
  if (!sciChartSurface || !fuelPressureDataSeries) return;
  const cfg = channelConfig['FuelPressure'];
  fuelPressureDataSeries.clear();
  fuelPressureDataSeries.appendRange(
    timeData.value.slice(-cfg.windowSamples),
    fuelPressureData.value.slice(-cfg.windowSamples)
  );
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  const cfg = channelConfig['FuelPressure'];

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-fuelpressure", {
    theme: new SciChartJSDarkTheme(),
    title: "Fuel Pressure",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;
  fuelPressureDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "orange",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: fuelPressureDataSeries,
  }));

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: cfg.yUnit,
    autoRange: EAutoRange.Never,
    visibleRange: new NumberRange(cfg.yMin, cfg.yMax),
  }));

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup })
  );

  chartSyncService.register(sciChartSurface);
  updateChart();
  watch([timeData, fuelPressureData], updateChart);
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
#scichart-fuelpressure {
  width: 100%;
  height: 240px;
}
</style>
