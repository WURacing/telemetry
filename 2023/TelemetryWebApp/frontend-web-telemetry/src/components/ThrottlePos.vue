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
  SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==");  SciChartSurface.useWasmFromCDN();
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
