<template>
  <div class="hello">
    <div id="track-map" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Ref, watch} from "vue";
import {useFileStoreStore} from "../stores/FileStore.js";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  XyDataSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
  SciChartJSDarkTheme,
  NumberRange,
  ZoomPanModifier,
  ZoomExtentsModifier,
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
const GPSXPos = ref([] as number[]);
const GPSYPos = ref([] as number[]);

// Watch for changes in the GPSXPos and GPSYPos variables of the Pinia store
watch([() => store.GPSXPos, () => store.GPSYPos], ([newGPSXPos, newGPSYPos]) => {
  // Update the local GPSXPos and GPSYPos variables with the new values
  GPSXPos.value = newGPSXPos;
  GPSYPos.value = newGPSYPos;

  // Call the initSciChart function to update the chart
  initSciChart();
});

async function initSciChart() {
  // LICENSING
      // Set this code in application startup, before creating a SciChartSurface
      SciChartSurface.setRuntimeLicenseKey("DA4krJsExAXg9FNs3eHwUpq8XW9UIAeptO/vi/CXnZpU1jo8vuiihT8lC0OGtNRI6SZ+TMWoKlvxlhE4OuIj+N+G+l4iNfYqO2OLFvdv9Ut7W3Mcd0L80FCYY3E4dIhYK5gSypAjBu4yUSty5rtvhBvn35eEEVVSRX7DmtJvFOH+qzKuPoIXAIvYX38ilAVoii6ZRgVl/ep/XH3XaPBAllYY3kQpHDTdVUazfipUwaMlqeJMYDEdY9Nu7qLhjQfikInf7WIZ3bwPATyxIJApxEG1eRUeCGo0m+CHoowRxZMKiFwhHaYPeOC7tfhqmTvNGyoKdNJk1wJ5WTy2Ek1WyE3oTsdqN6zWWJhwqZS9V9x/EdjoFnOP1x7UMDw6Fz+liJ5ZSphiHLXF7SqAibtd6okS/CUcLGkENnSBQ6gq2lW4iAKDTMxNWdyib4o4i8Cy+lE/YbB2K+txH1W829K0BqB+GGzBYreeXzhmxTefmtK0P6qrofODUuRpQv7czj86C813Bbe8qzQ+v1mS7k6m+z+dS0jkwuHELv7hvUiyPRuZnjr5iHQjwNZSvCa6BglCPDOKRTuUae1Lw69rF0lmmObuUL/oaRCm98zI86eiZv5cXpOeFRXnKvBZRlw16AwHpDupkNYwswdh53YFGlzVUQ==");
      SciChartSurface.useWasmFromCDN();

      // Initialize SciChartSurface. Don't forget to await!
      const { wasmContext, sciChartSurface } = await SciChartSurface.create("track-map", {
        theme: new SciChartJSDarkTheme(),
        title: "Track Map",
        titleStyle: { fontSize: 18 },
      });

      let xValues = [Number.NaN];
      let yValues = [Number.NaN];

      for (let i = 0; i < GPSXPos.value.length; i++) {
        xValues.push(GPSXPos.value[i]);
        yValues.push(GPSYPos.value[i]);
      }

      // we'll use this dataseries as our data source
      const ggDataSeries = new XyDataSeries(wasmContext);
      // Map each point to (x, y) coordinates
      for (let i = 0; i < GPSXPos.value.length; i++) {
        ggDataSeries.append(xValues[i], yValues[i]);
      }

      // Add X and Y axes with growBy padding
      const xMin = (Math.min.apply(null, GPSXPos.value.map(function(x) { return !isNaN(x); }).filter(Boolean))) + 0.001;
      const xMax = (Math.max.apply(null, GPSXPos.value.map(function(x) { return !isNaN(x); }).filter(Boolean))) + 0.001;
      const yMin = (Math.min.apply(null, GPSYPos.value.map(function(x) { return !isNaN(x); }).filter(Boolean))) + 0.001;
      const yMax = (Math.max.apply(null, GPSYPos.value.map(function(x) { return !isNaN(x); }).filter(Boolean))) + 0.001;
      const growBy = new NumberRange(0.001, 0.001);
      const xAxis = new NumericAxis(wasmContext, {
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        autoRange: EAutoRange.Always,
        axisBorder: { color: "white" },
        // axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(xMin, xMax),
        growBy
      });
      const yAxis = new NumericAxis(wasmContext, {
        isInnerAxis: true,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        autoRange: EAutoRange.Always,
        visibleRange: new NumberRange(yMin, yMax),
        growBy
      });

          // Add the X and Y axes to the chart
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    // Turn the dataSeries into renderable scatter plot data
    sciChartSurface.renderableSeries.add(
      new XyScatterRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
        pointMarker: new EllipsePointMarker(wasmContext, {
          width: 4,
          height: 4,
          strokeThickness: 0,
          fill: "#ca982c",
          opacity: 0.7,
          // animation: new SweepAnimation({ duration: 500 })
        })
      })
    );

    return { sciChartSurface, wasmContext };
  }

  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  </style>
