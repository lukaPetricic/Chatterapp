import React, { useState } from 'react';

function Chat({ activeUsers, username, chattingWith, changeChat, currentMessages, sendMessage }) {
    return (
        <div id="chatpage">
            <h1>Main chat page</h1>
            <ActiveUsersList activeUsers={activeUsers} changeChat={changeChat} username={username} />
            <ChatBox
                activeUsers={activeUsers}
                username={username}
                chattingWith={chattingWith}
                currentMessages={currentMessages}
                sendMessage={sendMessage}
            />
        </div>
    )
}

function ActiveUsersList({ activeUsers, changeChat, username }) {
    function handleClick(user) {
        changeChat(user)
    }

    let filteredActiveUsers = activeUsers.filter(user => user.username !== username)

    return (
        <div id="activeUsersList">
            {filteredActiveUsers.map((user, i) => 
            <div onClick={() => handleClick(user)} key={i}>{user.username}{user.unseen ? '+1!' : null}</div>)}
        </div>
    )
}

function ChatBox({ activeUsers, username, chattingWith, currentMessages, sendMessage }) {
    const [currentMessage, setCurrentMessage] = useState('')

    function handleSubmit(e) {
        e.preventDefault();
        let fullMessage = {
            body: currentMessage,
            timestamp: new Date(),
            sender: username
        }
        sendMessage(fullMessage, chattingWith)
        e.target.reset();
        setCurrentMessage('')
    }
    return (
        <div id="chatWindow">
            <MessageDisplay currentConversation={currentMessages} username={username}/>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder={"Message to " + chattingWith} onChange={(e) => setCurrentMessage(e.target.value)}></input>
                <input type="submit" value="Send"></input>
            </form>
        </div>
    )
}

function MessageDisplay({ currentConversation, username }) {
    return (
        <div id="messageDisplay">
            {currentConversation.map((message, i) =>
                <div key={i}>
                    <div>{message.sender === username ? 'You' : message.sender}</div>
                    <div>{message.timestamp.toString()}</div>
                    <div>{message.body}</div>
                </div>
            )}
        </div>
    )
}

export default Chat;