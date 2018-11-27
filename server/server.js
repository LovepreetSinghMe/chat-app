const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname + '/../public');

let server = http.createServer(app);
let io = socketIO(server);

//express middleware
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'Mike',
        text: "Hey what happened",
        createdAt: 12121
    });

    socket.on('createMessage', (message) => {
        console.log(message);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});