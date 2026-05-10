<template>
  <div class="hello">
    <div id="scichart-rpm"></div>
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
let rpmDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const rpmData = computed(() => store.EngineRPM);

const updateChart = () => {
  if (!sciChartSurface || !rpmDataSeries) return;
  const cfg = channelConfig['EngineRPM'];
  rpmDataSeries.clear();
  rpmDataSeries.appendRange(
    timeData.value.slice(-cfg.windowSamples),
    rpmData.value.slice(-cfg.windowSamples)
  );
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  const cfg = channelConfig['EngineRPM'];

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-rpm", {
    theme: new SciChartJSDarkTheme(),
    title: "RPM",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;
  rpmDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "white",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: rpmDataSeries,
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
  watch([timeData, rpmData], updateChart);
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
