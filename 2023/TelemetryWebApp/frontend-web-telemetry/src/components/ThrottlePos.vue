<template>
  <div class="throttle">
    <div id="scichart-throttle"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import { useFileStoreStore } from "../stores/FileStore.js";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  FastLineRenderableSeries,
  XyDataSeries,
  SweepAnimation,
  SciChartJSDarkTheme,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null;
let throttleDataSeries: XyDataSeries | null = null;

const timeData = computed(() => store.Time);
const throttleposData = computed(() => store.ThrottlePosition);

const updateChart = () => {
  if (!sciChartSurface || !throttleDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  throttleDataSeries.append();

  for (let i = 0; i < timeData.value.length; i++) {
    throttleDataSeries.append(timeData.value[i], throttleposData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.useWasmFromCDN();
  SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==")

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

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always, drawLabels: false}));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "%", autoRange: EAutoRange.Always}));
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());


  updateChart();

  watch([timeData, throttleposData], () => {
    updateChart();
  })
});
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
