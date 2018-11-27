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

$(function() {
    $('#message-form').on('submit', function(e) {
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function() {

        });
    });
});