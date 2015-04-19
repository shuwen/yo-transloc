var unirest = require('unirest'),
	sleep = require('sleep'),
	querystring = require('querystring');

module.exports = function(io) {
	io.on('connection', function(socket) {

		socket.on('locate', function(d) {
			busList(d.lat,d.lon,socket);
		});

		socket.on('watch', function(d) {
			findBus(d.bus,d.t,d.user,socket);
		});

	});
}

// Helper function that "Yo"s the specific user
function yo(user) {
	var request = unirest.post("http://api.justyo.co/yo/")
	.send({
		'api_token': '***REMOVED***',
		'username': user
	})
	.end(function(res) {
		console.log(res.body);
	});
}

/**
 * Helper function that takes in a lat/long position and 
 * returns a list of bus stops within that cirlce
 **/
function busList(lat,lon,soc) {
	var reqPath = 'https://transloc-api-1-2.p.mashape.com/stops.json?agencies=100&geo_area='+(lat + 0.003)+','+(lon - 0.003)+'|'+(lat - 0.003)+','+(lon + 0.003);

	var request = unirest.get(reqPath)
	.header("X-Mashape-Key", "***REMOVED***")
	.header("Accept", "application/json")
	.end(function (res) {
		soc.emit('busList', {buses: res.body.data});
	});
}

// Helper function that queries API until true
function findBus(id,t,user,soc) {
	var busFound = false;
	var reqPath = "https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=100&stops="+id;

	var request = unirest.get(reqPath)
	.header("X-Mashape-Key", "***REMOVED***")
	.header("Accept", "application/json")
	.end(function (res) {
		if ( (Date.parse(res.body.data[0].arrivals[0].arrival_at) - Date.now() ) < t*60000 ) {
			yo(user);
			soc.emit('bus', {});
		} else {
			// Wait 1 minute and run this function again
			sleep.sleep(60);
			findBus(id);
		}
	});
};