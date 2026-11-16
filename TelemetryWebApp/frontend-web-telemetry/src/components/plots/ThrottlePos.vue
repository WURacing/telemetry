<template>
  <div class="hello">
    <div id="scichart-throttle"></div>
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
let throttleDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const throttleData = computed(() => store.ThrottlePosition);

const updateChart = () => {
  if (!sciChartSurface || !throttleDataSeries) return;
  const cfg = channelConfig['ThrottlePosition'];
  throttleDataSeries.clear();
  throttleDataSeries.appendRange(
    timeData.value.slice(-cfg.windowSamples),
    throttleData.value.slice(-cfg.windowSamples)
  );
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  const cfg = channelConfig['ThrottlePosition'];

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
  watch([timeData, throttleData], updateChart);
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
