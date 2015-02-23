// var http = require('http'),
var unirest = require('unirest'),
	sleep = require('sleep'),
	querystring = require('querystring');

module.exports = function(io) {
	io.on('connection', function(socket) {

		socket.on('test', function() {
			console.log('test: it works');
			socket.emit('bus', {});
		});

		socket.on('watch', function(d) {
			var f = false;
			findBus(d.bus);
			while(!f) {
				console.log('calling findBus()');
				f = findBus(d.bus);
				console.log('sleeping 30');
				sleep.sleep(30);
			}
			if(f) {
				console.log('it works');
			}
		});

	});

	function findBus(id) {
		var busFound = false;

		var request = unirest.get("https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=100&stops="+id)
		.header("X-Mashape-Key", "***REMOVED***")
		.header("Accept", "application/json")
		.end(function (res) {
			console.log(res.body);
			console.log('findBus(), within http callback');
			console.log(res.body.data[0].arrivals[0].arrival_at);

			if ( (Date.parse(res.body.data[0].arrivals[0].arrival_at) - Date.now() ) < 240000 ) {
				socket.emit('bus', {});
				busFound = true;
			}
		});

		return busFound;
	};
}