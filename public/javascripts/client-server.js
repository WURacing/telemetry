/**
 * Starts the client and server pushing functionality
 */

var totalPoints = 100;
var serverUpdates = 100;
var clientUpdates = 25;
var socket, dataset;
var now = new Date().getTime();
var somePlot = null;
var showData = [true, true];

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
            max: 50,
            position: "right",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        }
    ]
};

function initData() {
    var data1 = [], data2 = [];
    for (var i = 0; i < totalPoints; i++) {
        var temp = [now += clientUpdates, 0];
 
        data1.push(temp);
        data2.push(temp);
    }
    dataset = [
        { label: "data 1", data: data1, lines: { lineWidth: 1.2 }, color: "#00FF00", idx: 0},
        { label: "data 2", data: data2, lines: { lineWidth: 1.2 }, color: "#0044FF", yaxis: 2, idx: 1 }
    ];
}
var startClientServer = function() {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    socket = io.connect('http://ec2-54-86-204-151.compute-1.amazonaws.com/TelemetryWeb');

    socket.emit('updateInterval', serverUpdates);
    /**
     * Repaint graph function.  This repaints the graph
     * at a timed interval
     */
    function repaintGraph(_data) {
        var someData = somePlot.getData();
        
        someData[0].data.shift();
        someData[1].data.shift();
        var temp = [_data[0], _data[1]];
        someData[0].data.push(temp);
        // console.log("data1: " + temp);
        temp = [_data[0], _data[2]];
        someData[1].data.push(temp);
        // console.log("data2: " + temp);
        someData[0].lines.show = showData[0];
        console.log(showData[0]);
        someData[1].lines.show = showData[1];
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