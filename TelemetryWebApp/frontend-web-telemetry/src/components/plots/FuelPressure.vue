<template>
  <div class="hello">
    <div id="scichart-fuelpressure"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch} from "vue";
import { useFileStoreStore } from "@/stores/FileStore";
import { chartSyncService } from "@/services/chartSync";
import {
  SciChartSurface,
  NumericAxis,
  EAutoRange,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJSDarkTheme,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  RolloverModifier
} from "scichart";

// Retrieve data from store
const store = useFileStoreStore();
let sciChartSurface: SciChartSurface | null = null; // To hold the chart surface instance
let fuelPressureDataSeries: XyDataSeries | null = null; // To hold the data series

const timeData = computed(() => store.Time);  // Make reactive
const fuelPressureData = computed(() => store.FuelPressure); // Make reactive

const updateChart = () => {
  if (!sciChartSurface || !fuelPressureDataSeries) {
    return; // Chart hasn't been initialized yet
  }

  // Clear existing data points (or append if you want a continuous scrolling chart)
  fuelPressureDataSeries.append();

  //Append new data points
  for (let i = 0; i < timeData.value.length; i++) {
    fuelPressureDataSeries.append(timeData.value[i], fuelPressureData.value[i]);
  }
};

onMounted(async () => {
  SciChartSurface.useWasmFromCDN();
  // SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==");

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("scichart-fuelpressure", {
    theme: new SciChartJSDarkTheme(),
    title: "Fuel Pressure",
    titleStyle: { fontSize: 24 }
  });
  sciChartSurface = surface;


  // Create the data series *once*
  fuelPressureDataSeries = new XyDataSeries(wasmContext);

  // ... (add axes, renderable series, etc., as before, but *outside* the watch)
    // Renderable series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "orange",
    strokeThickness: 3,
    opacity: 1,
    dataSeries: fuelPressureDataSeries,
  }));

  const modifierGroup = chartSyncService.modifierGroupId;
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup }),
    new MouseWheelZoomModifier({ modifierGroup }),
    new ZoomExtentsModifier({ modifierGroup }),
    new RolloverModifier({ modifierGroup })
  );

   // Axes
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, drawLabels: false}));

  chartSyncService.register(sciChartSurface);

  updateChart();// Initial chart setup

  watch([timeData, fuelPressureData], () => {
    updateChart();  // Update the chart when data changes
  });

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
#scichart-fuelpressure {
  width: 100%;
  height: 240px;
}
</style>
