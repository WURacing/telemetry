<template>
  <div class="hello">
    <div id="track-map" />
  </div>
</template>

<script setup lang="ts">
  // Displays the GPS location of the car throughout the session
  // TODO: make slightly transparent, and use Google Maps to overlay data points with satellite imagery

import {computed, onMounted, onUnmounted, watch} from "vue";
import {useFileStoreStore} from "../../stores/FileStore.js";
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
  SciChartDefaults,
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null; // To hold the chart surface instance
let trackDataSeries: XyDataSeries | null = null; // To hold the data series

const gpsXData = computed(() => store.GPSXPos);  // Make reactive
const gpsYData = computed(() => store.GPSYPos); // Make reactive
let liveStatus = store.isLive;

const updateChart = () => {
  if (!sciChartSurface || !trackDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  if (liveStatus) {
    let ly = gpsYData.value.length - 1
    let lx = gpsXData.value.length - 1
    trackDataSeries?.append(gpsXData.value[lx], gpsYData.value[ly]);
  } else {
    trackDataSeries?.clear();
    trackDataSeries?.appendRange(gpsXData.value, gpsYData.value);
  }
};


onMounted(async () => {
  SciChartSurface.UseCommunityLicense();
  SciChartDefaults.performanceWarnings = false;

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("track-map", {
    theme: new SciChartJSDarkTheme(),
    title: "Track Map",
    titleStyle: { fontSize: 16 }
  });
  sciChartSurface = surface;

  trackDataSeries = new XyDataSeries(wasmContext);

  sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, {
          width: 3,
          height: 3,
          strokeThickness: 0,
          fill: "#ca982c",
          opacity: 1
        }),
    dataSeries: trackDataSeries
      }));

  // Modifiers
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
  // Axes
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isInnerAxis: true,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawLabels: false,
        autoRange: EAutoRange.Always
        }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isInnerAxis: true,
    drawMajorGridLines: false,
    drawMinorGridLines: false,
    drawLabels: false,
    autoRange: EAutoRange.Always
  }));


  updateChart();// Initial chart setup

  watch([gpsXData, gpsYData], () => {
    updateChart();  // Update the chart when data changes
  });

});

onUnmounted(async () => {
  sciChartSurface?.delete();
})
  </script>

  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  </style>
