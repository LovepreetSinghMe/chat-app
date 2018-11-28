const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname + '/../public');

let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
let rooms = new Rooms();

//express middleware
app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('updateRoomsRequest', (message, callback) => {
        let roomsList = rooms.roomsList;

        callback(roomsList);
    });

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name are required');
        }

        if(!rooms.checkRoomExists(params.room)) {
            rooms.createRoom(params.room);
        }

        socket.join(params.room);
        // socket.leave();
        users.removeUser(socket.id);

        if(users.checkUserExists(params.name, params.room)) {
            return callback('A user with the same name exists in the same room. Please use a different name.');
        }
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords, callback) => {
        let user = users.getUser(socket.id);

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        callback();
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));

            if(users.getUserList(user.room).length === 0) {
                rooms.deleteRoom(user.room);
            }
        }

    });
});

server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});