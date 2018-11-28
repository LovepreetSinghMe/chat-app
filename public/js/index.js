let socket = io();

socket.on('connect', function() {

    socket.emit('updateRoomsRequest', {}, function(roomsList){
        let select = $('<select name="room"></select>');

        select.append($('<option></option>').text('--none selected--'));

        roomsList.forEach(function(el) {
            select.append($(`<option value="${el}"></option>`).text(el));
        });

        $('#rooms').html(select);
    });
});