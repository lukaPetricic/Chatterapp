import React, {useState} from 'react';
import { io } from 'socket.io-client';
const socket = io()

function App() {
    return (
        <h1>Hello, brave new World!</h1>
    )
}

export default App;