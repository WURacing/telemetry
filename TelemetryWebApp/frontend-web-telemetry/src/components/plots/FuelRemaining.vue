<template>
  <div class="hello">
    <div id="scichart-fuelremaining"></div>
  </div>
</template>

<script setup lang="ts">
// Fuel left over time (tank size - fuel used), with the yellow/red thresholds drawn as lines.
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useFileStoreStore } from "../../stores/FileStore";
import { chartSyncService } from "../../services/chartSync";
import { fuelConfig } from "../../services/fuelConfig";
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
  RolloverModifier,
  HorizontalLineAnnotation,
} from "scichart";

const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null;
let dataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const usedData = computed(() => store.FuelUsed);

// NaN (no fuel data) stays NaN, which SciChart draws as a gap.
const toLeft = (used: number) => fuelConfig.TANK_LITERS - used;

const updateChart = () => {
  if (!sciChartSurface || !dataSeries) return;

  if (store.isLive) {
    const t = timeData.value[timeData.value.length - 1];
    const u = usedData.value[usedData.value.length - 1];
    if (t !== undefined && u !== undefined) dataSeries.append(t, toLeft(u));
  } else {
    dataSeries.clear();
    // Uploaded CSV files have no fuel column; only plot when the arrays line up.
    if (usedData.value.length && usedData.value.length === timeData.value.length) {
      dataSeries.appendRange(timeData.value, usedData.value.map(toLeft));
    }
  }
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-fuelremaining", {
    theme: new SciChartJSDarkTheme(),
    title: "Fuel Left (L)",
    titleStyle: { fontSize: 24 },
  });
  sciChartSurface = surface;

  dataSeries = new XyDataSeries(wasmContext);
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#22c55e",
    strokeThickness: 3,
    dataSeries,
  }));

  sciChartSurface.annotations.add(
    new HorizontalLineAnnotation({ y1: fuelConfig.YELLOW_LITERS, stroke: "#facc15", strokeThickness: 2, strokeDashArray: [6, 4] }),
    new HorizontalLineAnnotation({ y1: fuelConfig.RED_LITERS, stroke: "#dc2626", strokeThickness: 2, strokeDashArray: [6, 4] }),
  );

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup }),
  );

  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    autoRange: EAutoRange.Never,
    visibleRange: new NumberRange(0, fuelConfig.TANK_LITERS),
  }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false }));

  chartSyncService.register(sciChartSurface);
  updateChart();
  watch([timeData, usedData], updateChart);
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
#scichart-fuelremaining {
  width: 100%;
  height: 240px;
}
</style>
