/**
 * Module dependencies.
 */
var http = require("http"),
    socketio = require("socket.io"),
    fs = require("fs"),
    randomizer = require('./randomizer'),
    express = require('express');
 
// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
var app = http.createServer(function(req, resp){
    // This callback runs when a new connection is made to our HTTP server.
 
    fs.readFile("index.html", function(err, data){
        // This callback runs when the client.html file has been read from the filesystem.
 
        if(err) return resp.writeHead(500);
        resp.writeHead(200);
        resp.end(data);
    });
});
app.listen(3456);
// all environments
// app.set('port', process.env.PORT || 5000);
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

//create the server
// var server = http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
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