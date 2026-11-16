<template>
  <div class="hello">
    <div :id="chartId"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useFileStoreStore } from '../../stores/FileStore';
import { chartSyncService } from '../../services/chartSync';
import { channelConfig } from '../../services/channelConfig';
import type { TelemetryField } from '../../stores/FileStore';
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
} from 'scichart';

const props = defineProps<{
  channel: TelemetryField;
  label: string;
  color?: string;
}>();

const chartId = `scichart-${props.channel}`;
const store = useFileStoreStore();

let sciChartSurface: SciChartSurface | null = null;
let dataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const channelData = computed(() => (store as any)[props.channel] as number[]);

const updateChart = () => {
  if (!sciChartSurface || !dataSeries) return;
  const cfg = channelConfig[props.channel];
  dataSeries.clear();
  dataSeries.appendRange(
    timeData.value.slice(-cfg.windowSamples),
    channelData.value.slice(-cfg.windowSamples)
  );
};

onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  const cfg = channelConfig[props.channel];

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create(chartId, {
    theme: new SciChartJSDarkTheme(),
    title: props.label,
    titleStyle: { fontSize: 24 },
  });
  sciChartSurface = surface;
  dataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: props.color ?? '#00bcd4',
    strokeThickness: 3,
    dataSeries,
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
    new RolloverModifier({ modifierGroup }),
  );

  chartSyncService.register(sciChartSurface);
  updateChart();
  watch([timeData, channelData], updateChart);
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
div > div {
  width: 100%;
  height: 220px;
}
</style>
