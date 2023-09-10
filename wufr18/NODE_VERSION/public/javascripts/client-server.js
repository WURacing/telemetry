/**
 * Starts the client and server pushing functionality
 */

var totalPoints = 50;
var serverUpdates = 100;
var socket, dataset;
var now = new Date().getTime();
var somePlot = null;
var showData = [];

var options = {
    series: {
        lines: {
            lineWidth: 1.2,
            show: true
        }
    },
    legend: {
        show: false
    },
    xaxis: {
        show: false
    },
    yaxes: [
        {
            min: 0,
            max: 100,
            tickSize: 5,
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }, {
            min: 0,
            max: 100,
            show: false,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }
    ]
};

function initData() {
    var numSeries = 11;
    var dataSeries = [];
    for (var i = 0; i < numSeries; i++) {
        dataSeries[i] = [];
    }
    for (var i = 0; i < totalPoints; i++) {
        var temp = [now += serverUpdates, 0];
 
        for (var j = 0; j < numSeries; j++) {
            dataSeries[j].push(temp);
        }
    }
    dataset = [
        { label: "data 1", data: dataSeries[0], lines: { lineWidth: 1.2 }, color: "#00FF00", idx: 0},
        { label: "data 2", data: dataSeries[1], lines: { lineWidth: 1.2 }, color: "#0044FF", yaxis: 2, idx: 1 },
        { label: "data 3", data: dataSeries[2], lines: { lineWidth: 1.2 }, color: "#FF0000", yaxis: 3, idx: 2 },
        { label: "data 4", data: dataSeries[3], lines: { lineWidth: 1.2 }, color: "#551A8B", yaxis: 4, idx: 3 },
        { label: "data 5", data: dataSeries[4], lines: { lineWidth: 1.2 }, color: "#FFA500", yaxis: 5, idx: 4 },
        { label: "data 6", data: dataSeries[5], lines: { lineWidth: 1.2 }, color: "#FF69B4", yaxis: 6, idx: 5 },
        { label: "data 7", data: dataSeries[6], lines: { lineWidth: 1.2 }, color: "#008080", yaxis: 7, idx: 6 },
        { label: "data 8", data: dataSeries[7], lines: { lineWidth: 1.2 }, color: "#228B22", yaxis: 8, idx: 7 },
        { label: "data 9", data: dataSeries[8], lines: { lineWidth: 1.2 }, color: "#104AAE", yaxis: 9, idx: 8 },
        { label: "data 10", data: dataSeries[9], lines: { lineWidth: 1.2 }, color: "#AE10A7", yaxis: 10, idx: 9 },
        { label: "data 11", data: dataSeries[10], lines: { lineWidth: 1.2 }, color: "#D8D019", yaxis: 11, idx: 10 }
    ];
    for (var i = 0; i < dataset.length; i++) {
        showData[i] = true;
    }
}
var startClientServer = function() {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    socket = io.connect(host);

    socket.emit('updateInterval', serverUpdates);
    /*
     * Repaint graph function.  This repaints the graph
     * at a timed interval
     */
    function repaintGraph(_data) {
        var someData = somePlot.getData();
        var temp;
        for (var i = 0; i < someData.length; i++) {
            someData[i].data.shift();
            temp = [_data[0], _data[i+1]];
            someData[i].data.push(temp);
            // someData[i].data = simplify(dataSeries[i], .08, true);
            // console.log(dataSeries[i]);
            // console.log(someData[i].data);
            someData[i].lines.show = showData[i];
        }
        somePlot.setData(someData);
        somePlot.setupGrid();
        somePlot.draw();
    }

    /*
     * Receiving data from the server
     */
    socket.on('dataSet', function(data) {
        repaintGraph(data);
    });

    socket.on('connect', function(e) {
        socket.emit('updateInterval', serverUpdates);
    });

    socket.io.on('connect_error', function(err) {
      // handle server error here
      socket.disconnect();
      console.log('Error connecting to server');
    });
    togglePlot = function(seriesIdx)
    {
        // console.log(showData[seriesIdx]);
        showData[seriesIdx] = !showData[seriesIdx];
    }
};