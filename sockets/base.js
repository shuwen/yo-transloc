var unirest = require('unirest'),
	sleep = require('sleep'),
	querystring = require('querystring');

module.exports = function(io) {
	io.on('connection', function(socket) {

		// For testing only
		socket.on('test', function() {
			console.log('test: it works');
			socket.emit('bus', {});
		});

		socket.on('watch', function(d) {
			var f = false;
			// Pass the bus id, time, and socket
			findBus(d.bus, d.t, socket);
		});

	});
}

// Helper function that queries API until true
function findBus(id, t, soc) {
	var busFound = false;
	var reqPath = "https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=100&stops="+id;

	var request = unirest.get(reqPath)
	.header("X-Mashape-Key", "***REMOVED***")
	.header("Accept", "application/json")
	.end(function (res) {
		if ( (Date.parse(res.body.data[0].arrivals[0].arrival_at) - Date.now() ) < t*60000 ) {
			soc.emit('bus', {});
		} else {
			// Wait 1 minute and run this function again
			sleep.sleep(60);
			findBus(id);
		}
	});
};