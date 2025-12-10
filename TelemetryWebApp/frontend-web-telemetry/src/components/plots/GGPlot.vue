<template>
  <div class="gg-plot">
    <div id="scichart-gg" />
  </div>
</template>

<script setup lang="ts">
import {onUnmounted, onMounted, watch, computed} from "vue";
import {useFileStoreStore} from "../../stores/FileStore";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  XyDataSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
  SciChartJSDarkTheme,
  ZoomPanModifier,
  ZoomExtentsModifier,
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null; // To hold the chart surface instance
let ggDataSeries: XyDataSeries | null = null; // To hold the data series

const xValues = computed(() => store.LatAcc);  // Make reactive
const yValues = computed(() => store.LongAcc); // Make reactive
let liveStatus = store.isLive;

const updateChart = () => {
  if (!sciChartSurface || !ggDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  if (liveStatus) {
    let lb = yValues.value.length - 1
    let lt = xValues.value.length - 1
    ggDataSeries?.append(xValues.value[lt], yValues.value[lb]);
  } else {
    ggDataSeries?.clear();
    ggDataSeries?.appendRange(xValues.value, yValues.value);
  }
};
onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-gg", {
    theme: new SciChartJSDarkTheme(),
    title: "G-G Plot",
    titleStyle: { fontSize: 16 }
  });
  sciChartSurface = surface;

  // Create the data series *once*
  ggDataSeries = new XyDataSeries(wasmContext);

  // ... (add axes, renderable series, etc., but *outside* the watch)
  // Renderable series
  sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
    strokeThickness: 2,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 2,
      height: 2,
      strokeThickness: 0,
      fill: "blue",
      opacity: 1
    }),
    dataSeries: ggDataSeries
  }));

  // Modifiers
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
  // Axes
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isInnerAxis: true,
    drawMajorGridLines: true,
    drawMinorGridLines: false,
    drawLabels: true,
    autoRange: EAutoRange.Always
  }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isInnerAxis: true,
    drawMajorGridLines: true,
    drawMinorGridLines: false,
    drawLabels: true,
    autoRange: EAutoRange.Always
  }));


  updateChart();// Initial chart setup

  watch([xValues, yValues], () => {
    updateChart();  // Update the chart when data changes
  });

});

onUnmounted(async () => {
  if (sciChartSurface) {
    sciChartSurface.delete();
    sciChartSurface = null;
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
