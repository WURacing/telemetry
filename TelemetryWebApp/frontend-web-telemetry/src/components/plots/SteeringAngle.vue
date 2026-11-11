<template>
  <div class="hello">
    <div id="scichart-steering"></div>
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
let steerDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const steerData = computed(() => store.SteeringAngle);

const updateChart = () => {
  if (!sciChartSurface || !steerDataSeries) return;
  const cfg = channelConfig['SteeringAngle'];
  steerDataSeries.clear();
  steerDataSeries.appendRange(
    timeData.value.slice(-cfg.windowSamples),
    steerData.value.slice(-cfg.windowSamples)
  );
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  const cfg = channelConfig['SteeringAngle'];

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-steering", {
    theme: new SciChartJSDarkTheme(),
    title: "Steering Angle",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;
  steerDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "orange",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: steerDataSeries,
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
  watch([timeData, steerData], updateChart);
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
#scichart-steering {
  width: 100%;
  height: 240px;
}
</style>
