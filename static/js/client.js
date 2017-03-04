$(function(){

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	socket.on('message', function(data) {
		if (data.hasOwnProperty("RPMs")) {
			$("#RPMs").text(data["RPMs"]);
		}
		if (data.hasOwnProperty("Gear")) {
			$("#Gear").text(data["Gear"]);
		}
	});

});