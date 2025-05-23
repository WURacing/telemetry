<template>
  <div class="gg-plot">
    <div id="scichart-gg" />
  </div>
</template>

<script setup lang="ts">
import {onUnmounted, onMounted, watch, computed} from "vue";
import {useFileStoreStore} from "@/stores/FileStore";
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

const updateChart = () => {
  if (!sciChartSurface || !ggDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  // Clear existing data points (or append if you want a continuous chart)
  ggDataSeries.append();

  //Append new data points
  for (let i = 0; i < xValues.value.length; i++) {
    ggDataSeries.append(xValues.value[i], yValues.value[i]);
  }
};
onMounted(async () => {
  SciChartSurface.useWasmFromCDN();
  // SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==");

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

  watch([xValues, yValues], () => {
    updateChart();  // Update the chart when data changes
  });

});

onUnmounted(async () => {
  sciChartSurface.delete();
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
