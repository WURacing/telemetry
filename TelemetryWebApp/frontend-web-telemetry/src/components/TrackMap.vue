<template>
  <div class="hello">
    <div id="track-map" />
  </div>
</template>

<script setup lang="ts">
  // Displays the GPS location of the car throughout the session
  // TODO: make slightly transparent, and use Google Maps to overlay data points with satellite imagery

import {computed, onMounted, onUnmounted, watch} from "vue";
import {useFileStoreStore} from "../stores/FileStore.js";
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
let trackDataSeries: XyDataSeries | null = null; // To hold the data series

const gpsXData = computed(() => store.GPSXPos);  // Make reactive
const gpsYData = computed(() => store.GPSYPos); // Make reactive

const updateChart = () => {
  if (!sciChartSurface || !trackDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  // Clear existing data points (or append if you want a continuous chart)
  trackDataSeries.append();

  //Append new data points
  for (let i = 0; i < gpsXData.value.length; i++) {
    trackDataSeries.append(gpsXData.value[i], gpsYData.value[i]);
  }
};


onMounted(async () => {
  SciChartSurface.UseCommunityLicense();

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
  sciChartSurface.delete();
})
  </script>

  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  </style>
