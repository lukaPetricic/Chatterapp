const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { runInNewContext } = require('vm');
const io = new Server(server);

let activeUsers = {};

app.use('/', express.static('./client/dist'))
app.get('/chat', (req, res) => {
    res.redirect('/');
})
app.get('/activeUsers', (req, res) => {
    console.log('serving activeUsers');
    let formattedUsers = [];
    for (let id in activeUsers) {
        formattedUsers.push({id, username: activeUsers[id]})
    }
    console.log(formattedUsers)
    res.send(formattedUsers);
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new user', (newUser) => {
        activeUsers[socket.id] = newUser.username;
        socket.broadcast.emit("new user", newUser);

    })
    socket.on('disconnect', () => {
        console.log(activeUsers[socket.id], 'user disconnected');
        delete activeUsers[socket.id];
        socket.broadcast.emit("user left", socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});