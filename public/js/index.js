let socket = io();

socket.on('connect',function () {
    console.log('connected to server.');

});

socket.on('disconnect', function() {
    console.log('disconnected from server.');
});

socket.on('newMessage', function(message) {
    console.log('new message recieved', message);

    $('#messages').append(`<li>${message.from}: ${message.text}</li>`);
});

socket.on('newLocationMessage', function(message) {
    $('#messages').append(`<li>${message.from}: <a target="_blank" href="${message.url}">My current location</a></li>`);
});

$(function() {
    $('#message-form').on('submit', function(e) {
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function() {
            $('[name=message]').val('');
        });
    });

    let locationButton = $('#send-location');
    locationButton.on('click', function() {
        if(!navigator.geolocation) {
            return alert('Geolocation not supported by your browser.');
        }

        locationButton.attr("disabled", "disabled").html('Sending...');

        navigator.geolocation.getCurrentPosition(function(position) {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, function() {
                locationButton.removeAttr("disabled").html('Send Location');
            });
        }, function() {
            alert('Unable to fetch location.');
            locationButton.removeAttr("disabled").html('Send Location');
        })
    });
});