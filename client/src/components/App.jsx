import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './Login.jsx';
import Chat from './Chat.jsx';
const socket = io({
    autoConnect: false
});

function App() {
    const [username, setUsername] = useState('');
    const [logged, setLogged] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);

    function login() {
        socket.connect();
        socket.on('connect', () => {
            socket.emit('new user', { username, id: socket.id })
            setLogged(true);
        })
        socket.on('new user', (newUser) => {
            setActiveUsers(activeUsers => [...activeUsers, newUser]);
            console.log(newUser, 'joined')
        })
        socket.on('user left', (userLeftId) => {
            setActiveUsers(activeUsers => activeUsers.filter(user => user.id !== userLeftId))
        })
    }

    useEffect(() => {
        if (logged) {
        fetch('/activeUsers')
            .then(response => response.json())
            .then(data => setActiveUsers(data));
        }
    }, [logged])


    return (
        <Router>
            <Route exact path="/">
                <Login username={username} setUsername={setUsername} login={login} />
            </Route>
            <Route path="/chat" component={Chat} />
        </Router>
    )
}

export default App;