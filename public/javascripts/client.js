(function() {
	var socket = io.connect();

	// Get our location (and then a list of buses)
	$('#locate').click(function() {
		$.geolocation.get({
			success: function(loc) {
				// Write geolocation location to view
				$('#location').html(loc.coords.latitude + 'N, ' + loc.coords.longitude + 'E');
				socket.emit('locate', {lat: loc.coords.latitude, lon: loc.coords.longitude});
			},
			error: function(e) {
				console.log(e);
			}
		});
	});

	// Submit bus info
	$('#submit').click(function() {
		socket.emit('watch', {
			bus: $('#buses').val(),
			t: parseInt($('#time').val()),
			user: $('#handle').val(),
		});
	});

	// Server will respond when there is a bus
	socket.on('bus', function() {
		flashTitle();
	});

	socket.on('busList', function(d) {
		$.each(d.buses, function(index,value) {
			$('#buses').append('<option value="'+value.stop_id+'">'+value.name+'</option>');
		});
		$('#submit').prop('disabled',false);
	});

	// Flash the page title
	function flashTitle() {
		var title = $('title');

		var oldTitle = title.text();
		var newTitle = 'Get ready for the bus!';

		setInterval(function() {
			if(title.text() == oldTitle)
				title.text(newTitle);
			else
				title.text(oldTitle);
		}, 900);
	}
})();