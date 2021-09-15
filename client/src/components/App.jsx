import React, { useState, useEffect, useRef } from 'react';
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
    const [chattingWith, setChattingWith] = useState('');
    const [currentMessages, setCurrentMessages] = useState([]);
    const latestChattingWith = useRef(chattingWith);
    function login() {
        socket.disconnect();
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
        socket.on('new message', (message) => {
            setActiveUsers(activeUsers => activeUsers.map(user => {
                if (user.username === message.sender) {
                    return {
                        ...user,
                        messages: [...user.messages, message],
                        unseen: message.sender === latestChattingWith.current ? false : true
                    }
                }
                return user;
            }))
            
            if (message.sender === latestChattingWith.current) {
                setCurrentMessages(currentMessages => [...currentMessages, message])
            }
        })
    }

    function changeChat(user) {
        setChattingWith(() => {
            latestChattingWith.current = user.username
            return user.username
        });
        setCurrentMessages(user.messages);
        setActiveUsers(activeUsers => activeUsers.map(listed => {
            if (listed.username === user.username) {
                return {
                    ...user,
                    unseen: false
                }
            }
            return listed;
        }))
    }

    function sendMessage(message, receiver) {
        setCurrentMessages(currentMessages => [...currentMessages, message]);
        let receiverId = activeUsers.find(user => user.username === receiver).id;
        socket.emit('new message', message, receiverId);

        setActiveUsers(activeUsers => activeUsers.map(user => {
            if (user.username === receiver) {
                return {
                    ...user,
                    messages: [...user.messages, message]
                }
            }
            return user;
        }))
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
            <Route path="/chat">
                <Chat
                    activeUsers={activeUsers}
                    username={username}
                    chattingWith={chattingWith}
                    changeChat={changeChat}
                    currentMessages={currentMessages}
                    sendMessage={sendMessage}
                />
            </Route>
        </Router>
    )
}

export default App;