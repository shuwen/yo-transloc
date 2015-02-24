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
			findBus(d.bus, socket);
		});

	});
}

/**
 * Helper function that queries API until true
 */
function findBus(id, soc) {
	var busFound = false;
	var reqPath = "https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=100&stops="+id;

	var request = unirest.get(reqPath)
	.header("X-Mashape-Key", "***REMOVED***")
	.header("Accept", "application/json")
	.end(function (res) {
		if ( (Date.parse(res.body.data[0].arrivals[0].arrival_at) - Date.now() ) < 240000 ) {
			soc.emit('bus', {});
			return busFound;
		} else {
			sleep.sleep(60);
			findBus(id);
		}
	});
};