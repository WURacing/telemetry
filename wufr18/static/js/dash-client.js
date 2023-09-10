$(function(){

	var decimalPlaces = new Object();
	$(".data").each(function(){
		decimalPlaces[$(this).attr("id")] = $(this).attr("decimals");
	});

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	socket.on('message', function(data) {
		for (var key in data){
			if (data.hasOwnProperty(key)){
				$("#"+key).text(data[key].toFixed(decimalPlaces[key]));
				if (key === 'FBrake' || key == 'RBrake'){
					brakeBias();
				}
			}
		}
	});

	function brakeBias() {
		var fbrake = parseFloat($('#FBrake').text());
		var rbrake = parseFloat($('#RBrake').text());
		var fbrakeb = 100 * fbrake / (fbrake + rbrake);
		var rbrakeb = 100 * rbrake / (fbrake + rbrake);
		$('#FBrakeBias').text(fbrakeb.toFixed(decimalPlaces['FBrakeBias']));
		$('#RBrakeBias').text(rbrakeb.toFixed(decimalPlaces['RBrakeBias']));		
	}

	function rotate(){

		//console.log("called rotate");

		var rpm = parseInt($("#RPMs").text(), 10);
		if(rpm || rpm == 0){
			var deg = (rpm/12000.0) * 309.0;

			deg = ((deg <= 309.0) ? deg : 309.0).toFixed(0);

			var dial = document.getElementById('dial');

		    dial.style.webkitTransform = 'rotate('+deg+'deg)'; 
		    dial.style.mozTransform    = 'rotate('+deg+'deg)'; 
		    dial.style.msTransform     = 'rotate('+deg+'deg)'; 
		    dial.style.oTransform      = 'rotate('+deg+'deg)'; 
		    dial.style.transform       = 'rotate('+deg+'deg)'; 
		}
	}

	setInterval(rotate, 500);

	/*$('#FBrake').change(function(){
		console.log('change!')
		brakeBias();
	});
	$('#RBrake').change(function(){
		brakeBias();
	});*/

});

window.onbeforeunload = function(e) {
    socket.disconnect();
};