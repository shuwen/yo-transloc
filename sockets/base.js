module.exports = function(io) {
	io.on('connection', function(socket) {

		socket.on('test', function() {
			socket.emit('bus', {});
		});

	});
}