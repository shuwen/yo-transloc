(function() {
	var socket = io.connect();

	// Get our location (and then a list of buses)
	$('#locate').click(function() {
		$.geolocation.get({
			success: function(loc) {
				// Write geolocation location to view
				$('#location').html(loc.coords.latitude + 'N, ' + loc.coords.longitude + 'E');

				// Populate list of buses
				$.ajax({
					'method': 'GET',
					'dataType': 'json',
					'headers': {
						'X-Mashape-Key': '***REMOVED***',
					},
					'url': 'https://transloc-api-1-2.p.mashape.com/stops.json?agencies=100&geo_area='+(loc.coords.latitude + 0.003)+','+(loc.coords.longitude - 0.003)+'|'+(loc.coords.latitude - 0.003)+','+(loc.coords.longitude + 0.003),

					'success': function(res) {
						// Add each of the buses we get as an option in our select
						$.each(res.data, function(index,value) {
							$('#buses').append('<option value="'+value.stop_id+'">'+value.name+'</option>');
						});
					} // end of ajax success function
				}); // end of ajax call
			}, // success
		});
	});

	// Submit bus info
	$('#submit').click(function() {
		socket.emit('watch', {
			bus: $('#buses').val(),
			time: parseInt($('#time').val())
		});
	});

	// Get the server to emit a test event back to us
	$('#test').click(function() {
		socket.emit('test', {});
	});

	// Server will respond when there is a bus
	socket.on('bus', function() {
		alert('it works, there is a bus');
		flashTitle();
	});

	// Implement this later
	function flashTitle() {
		var oldTitle = document.title;
		var newTitle = 'Yo!';
	}

})();