let socket = io();

function scrollToBottom() {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect',function () {
    console.log('connected to server.');

});

socket.on('disconnect', function() {
    console.log('disconnected from server.');
});

socket.on('newMessage', function(message) {
    let fromattedTime = moment(message.createdAt).format('h:mm a');

    // $('#messages').append(`<li>${message.from} | ${fromattedTime}: ${message.text}</li>`);

    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: fromattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    let fromattedTime = moment(message.createdAt).format('h:mm a');

    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: fromattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
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