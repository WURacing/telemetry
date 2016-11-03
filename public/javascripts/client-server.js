/**
 * Starts the client and server pushing functionality
 */

var totalPoints = 100;
var serverUpdates = 100;
var clientUpdates = 25;
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
        }
    ]
};

function initData() {
    var data1 = [], data2 = [], data3 = [], data4 = [], data5 = [], data6 = [];
    for (var i = 0; i < totalPoints; i++) {
        var temp = [now += clientUpdates, 0];
 
        data1.push(temp);
        data2.push(temp);
        data3.push(temp);
        data4.push(temp);
        data5.push(temp);
        data6.push(temp);
    }
    dataset = [
        { label: "data 1", data: data1, lines: { lineWidth: 1.2 }, color: "#00FF00", idx: 0},
        { label: "data 2", data: data2, lines: { lineWidth: 1.2 }, color: "#0044FF", yaxis: 2, idx: 1 },
        { label: "data 3", data: data3, lines: { lineWidth: 1.2 }, color: "#FF0000", yaxis: 3, idx: 2 },
        { label: "data 4", data: data4, lines: { lineWidth: 1.2 }, color: "#551A8B", yaxis: 4, idx: 3 },
        { label: "data 5", data: data5, lines: { lineWidth: 1.2 }, color: "#FFA500", yaxis: 5, idx: 4 },
        { label: "data 6", data: data6, lines: { lineWidth: 1.2 }, color: "#FF69B4", yaxis: 6, idx: 5 }
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
    /**
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