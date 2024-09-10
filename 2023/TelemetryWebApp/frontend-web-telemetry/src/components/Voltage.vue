<template>
  <div class="throttle">
    <div id="scichart-throttle"></div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { type Ref, ref, watch } from "vue";
import { useFileStoreStore } from "../stores/FileStore.js";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJSDarkTheme,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
const Time = ref([] as number[]);
const ThrottlePosition = ref([] as number[]);

// Setup variables for realtime chart updates
const numberOfPointsPerTimerTick = 10; // 10 points every timer tick
const timerInterval = 50; // timer tick every 50 milliseconds

// Watch for changes in the GPSXPos and GPSYPos variables of the Pinia store
watch([() => store.Time, () => store.ThrottlePosition], ([newTime, newThrottlePosition]) => {
  // Update the local GPSXPos and GPSYPos variables with the new values
  Time.value = newTime;
  ThrottlePosition.value = newThrottlePosition;

  // Call the initSciChart function to update the chart
  initSciChart();
});

async function initSciChart() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  SciChartSurface.setRuntimeLicenseKey("DA4krJsExAXg9FNs3eHwUpq8XW9UIAeptO/vi/CXnZpU1jo8vuiihT8lC0OGtNRI6SZ+TMWoKlvxlhE4OuIj+N+G+l4iNfYqO2OLFvdv9Ut7W3Mcd0L80FCYY3E4dIhYK5gSypAjBu4yUSty5rtvhBvn35eEEVVSRX7DmtJvFOH+qzKuPoIXAIvYX38ilAVoii6ZRgVl/ep/XH3XaPBAllYY3kQpHDTdVUazfipUwaMlqeJMYDEdY9Nu7qLhjQfikInf7WIZ3bwPATyxIJApxEG1eRUeCGo0m+CHoowRxZMKiFwhHaYPeOC7tfhqmTvNGyoKdNJk1wJ5WTy2Ek1WyE3oTsdqN6zWWJhwqZS9V9x/EdjoFnOP1x7UMDw6Fz+liJ5ZSphiHLXF7SqAibtd6okS/CUcLGkENnSBQ6gq2lW4iAKDTMxNWdyib4o4i8Cy+lE/YbB2K+txH1W829K0BqB+GGzBYreeXzhmxTefmtK0P6qrofODUuRpQv7czj86C813Bbe8qzQ+v1mS7k6m+z+dS0jkwuHELv7hvUiyPRuZnjr5iHQjwNZSvCa6BglCPDOKRTuUae1Lw69rF0lmmObuUL/oaRCm98zI86eiZv5cXpOeFRXnKvBZRlw16AwHpDupkNYwswdh53YFGlzVUQ==");
  SciChartSurface.useWasmFromCDN();

  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-throttle", {
    theme: new SciChartJSDarkTheme(),
    title: "Throttle Position",
    titleStyle: { fontSize: 32 }
  });
  SciChartSurface.UseCommunityLicense();

  // Create an XAxis and YAxis with growBy padding
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always}));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "%", autoRange: EAutoRange.Always}));

  // Import the data from our CSV into an array
  const xValues = [0, 0];
  const yValues = [0, 0];
  for (let i = 0; i < Time.value.length; i++) {
    xValues.push(Time.value[i]);
    yValues.push(ThrottlePosition.value[i]);
  }

  const speedDataSeries = new XyDataSeries(wasmContext);
  // Map each point to (x, y) coordinates
  for (let i = 0; i < Time.value.length; i++) {
    speedDataSeries.append(xValues[i], yValues[i]);
  }
  // Create a line series with some initial data
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "green",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: speedDataSeries,
  }));

  // Add some interaction modifiers to show zooming and panning
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

  return sciChartSurface;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#scichart-throttle {
  width: 100%;
  height: 240px;
}
</style>
