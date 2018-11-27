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
   let params = $.deparam(window.location.search);
   
   socket.emit('join', params, function(err) {
    if(err) {
        alert(err);
        window.location.href = '/';
    } else {
        console.log('No error');
    }
   }); 
});

socket.on('disconnect', function() {
    console.log('disconnected from server.');
});

socket.on('updateUserList', function(users) {
    let ol = $('<ol></ol>');

    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

socket.on('newMessage', function(message) {
    let fromattedTime = moment(message.createdAt).format('h:mm a');

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