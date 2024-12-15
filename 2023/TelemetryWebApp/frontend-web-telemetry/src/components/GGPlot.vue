<template>
  <div class="gg-plot">
    <div id="scichart-gg" />
  </div>
</template>

<script setup lang="ts">
import {onUnmounted, onMounted, ref, watch, type Ref, computed} from "vue";
import {useFileStoreStore} from "../stores/FileStore.js";
import {
  SciChartSurface,
  NumericAxis,
  CentralAxesLayoutManager,
  ICentralAxesLayoutManagerOptions,
  EInnerAxisPlacementCoordinateMode,
  EAutoRange,
  XyDataSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJSDarkTheme,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  RenderContext2D,
  EAxisAlignment,
  ScatterAnimation,
  PointMarkerStyle,
  IAnimation,
  EPointMarkerType
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
  SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==");

  const { wasmContext, sciChartSurface: surface } = await SciChartSurface.create("track-map", {
    theme: new SciChartJSDarkTheme(),
    title: "Track Map",
    titleStyle: { fontSize: 16 }
  });
  sciChartSurface = surface;

  // Create the data series *once*
  trackDataSeries = new XyDataSeries(wasmContext);

  // ... (add axes, renderable series, etc., as before, but *outside* the watch)
  // Renderable series
  sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
    strokeThickness: 2,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 4,
      height: 4,
      strokeThickness: 0,
      fill: "#ca982c",
      opacity: 0.7
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

// async function initSciChart() {
//   // LICENSING
//   // Set this code in application startup, before creating a SciChartSurface
//   SciChartSurface.setRuntimeLicenseKey("BDF7cXttucLnCaaYIAS54uSgBWzs487JMNwSckfExL1EP3xIsI4RElNwQLBZwn5trxtZ3IsQ8fRT5vz7K/eXslQKwlqyltc7sFCeuQJlbTngfgVUgFKKkL/ocK6+aE0zvnCLdBcmKp12xyCIMc/S25Nh50woR7K1ORF4wWXCBOGe6twlLm4UVBbsRrOpZI057eSH8jmk7GEM40WPQvGd+osy3cehnEezJ8QFg4TFYr67SRwAMDIRWh7z6XTWwS+ilrt8QTo1t6DDqXpQiz2lC/ajwAlxc90PXVKbXNAAxcvdPp4yIapUH/cMuoqNWL229ctFZc6wCe2+n0/deGgsYc8PXtHTzdrdcY+YP+TlQzwEKilPzLxtswLlPkggV9k+8sd4JiCy6Ok3WQ2nkbRaR0aUnZi3CEWMqHM7qORAxQsgcS6jwfc4zsmgnSq3zW4VRwU3DXf2BLAiW9/H3brDXEN+RaW8bJovXH2Y2gxmiMTN3t4Hlzjl9aFceNBRuehv1tuS7o4rQCmXX5YqUYJC7CWd8h4XtiW5n7q8vlxClLNH+4EYia2SvHLzhI/AWK/JzKpm7u1dNqltd117RowqORy9jeuxlUZRfeNUZfg98QcUZtnOK+OHsCnjH+r9FfJ5UcLge297/NkThKKuukUfWw==");
//   SciChartSurface.useWasmFromCDN();
//
//   // Initialize SciChartSurface. Don't forget to await!
//   const { wasmContext, sciChartSurface } = await SciChartSurface.create("scichart-gg", {
//     theme: new SciChartJSDarkTheme(),
//     title: "GG Plot",
//     titleStyle: { fontSize: 18 },
//   });
//
//   const xValues = [0, 0];
//   const yValues = [0, 0];
//
//   for (let i = 0; i < LatAcc.value.length; i++) {
//     xValues.push(LatAcc.value[i]);
//     yValues.push(LongAcc.value[i]);
//   }
//
//   // we'll use this dataseries as our data source
//   const ggDataSeries = new XyDataSeries(wasmContext);
//
//   // Map each point to (x, y) coordinates
//   for (let i = 0; i < LatAcc.value.length; i++) {
//     ggDataSeries.append(xValues[i], yValues[i]);
//   }
//
//   // Set up our central axis
//   const options: ICentralAxesLayoutManagerOptions = {
//         horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
//         verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
//         horizontalAxisPosition: 0.5,
//         verticalAxisPosition: 0.5
//     };
//
//     // Control the placement of the axis by specifying CentralAxesLayoutManager
//     // and isInnerAxis property
//     sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);
//
//   // Add X and Y axes with growBy padding
//   const xMin = -1.65;
//   const xMax = 1.65
//   const yMin = -1;
//   const yMax = 1;
//   const growBy = new NumberRange(0.1, 0.1);
//   const xAxis = new NumericAxis(wasmContext, {
//      drawMajorGridLines: false,
//      drawMinorGridLines: false,
//      autoRange: EAutoRange.Never,
//      axisBorder: { color: "white" },
//      axisAlignment: EAxisAlignment.Bottom,
//      visibleRange: new NumberRange(xMin, xMax),
//      growBy
//    });
//  const yAxis = new NumericAxis(wasmContext, {
//        isInnerAxis: true,
//        drawMajorGridLines: false,
//        drawMinorGridLines: false,
//        autoRange: EAutoRange.Never,
//        visibleRange: new NumberRange(yMin, yMax),
//        growBy
//     });
//
//   // Add the X and Y axes to the chart
//   sciChartSurface.xAxes.add(xAxis);
//   sciChartSurface.yAxes.add(yAxis);
//   sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
//
//   // Turn the dataSeries into renderable scatter plot data
//  const graph = new XyScatterRenderableSeries(wasmContext, {
//       strokeThickness: 2,
//       dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
//       pointMarker: new EllipsePointMarker(wasmContext, {
//         width: 2,
//         height: 2,
//         strokeThickness: 0,
//         fill: "#409fff",
//         opacity: 0.7,
//        })
//     })
//
//
//   sciChartSurface.renderableSeries.add(graph);
//
//   // const pointAnimation = new ScatterAnimation({
//   //   duration: 2500,
//   //   fadeEffect: true
//   // });
//   // graph.enqueueAnimation(pointAnimation);
//
//   return { sciChartSurface, wasmContext };
// }
onUnmounted(async () => {
  sciChartSurface.delete();
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
</style>
