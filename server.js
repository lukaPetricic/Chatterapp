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
    let formattedUsers = [];
    for (let id in activeUsers) {
        formattedUsers.push({ id, username: activeUsers[id], messages: [], unseen: false })
    }
    res.send(formattedUsers);
})

app.get('/isUsernameTaken/:username', (req, res) => {
    if (Object.values(activeUsers).includes(req.params.username)) {
        res.send(true)
    } else {
        res.send(false)
    }
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new user', (newUser) => {
        let formatedUser = { ...newUser, messages: [], unseen: false }
        activeUsers[socket.id] = newUser.username;
        socket.broadcast.emit("new user", formatedUser);

    })
    socket.on('disconnect', () => {
        console.log(activeUsers[socket.id], 'user disconnected');
        delete activeUsers[socket.id];
        socket.broadcast.emit("user left", socket.id);
    });
    socket.on('new message', (message, receiverId) => {
        console.log(receiverId)
        io.to(receiverId).emit('new message', message);
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});