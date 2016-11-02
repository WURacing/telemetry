/**
 * Module dependencies.
 */
var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),

    // io = require('socket.io').listen(app),
    randomizer = require('./randomizer');

// all environments
app.set('port', 5000);
// app.use(express.favicon());
app.use(express.logger('dev'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// //create the server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/public/index.html');
// });

//Socket IO specifics
var io = require('socket.io').listen(server, { log: false });
io.sockets.on('connection', function (socket) {
    console.log("new client connected");
    var interval = setInterval(function() {
        var randomData = randomizer.getRandomData();
        socket.emit('dataSet', randomData);
    }, 1);
    socket.on('updateInterval', function (intervalData) {
        //Update the interval that is coming from the client
        clearInterval(interval);
        interval = setInterval(function() {
            var randomData = randomizer.getRandomData();
            // console.log(randomData);
            socket.emit('dataSet', randomData);
        }, intervalData);
    });
});