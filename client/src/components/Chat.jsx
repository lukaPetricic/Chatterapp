import React, { useState } from 'react';
import TimeAgo from 'react-timeago';

function Chat({ activeUsers, username, chattingWith, changeChat, currentMessages, sendMessage }) {
    return (
        <div id="chatpage">
            <h1>Chatterapp</h1>
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
            <h2>Users online:</h2>
            {filteredActiveUsers.map((user, i) =>
                <div onClick={() => handleClick(user)} key={i}>{user.username}{user.unseen ? <img src="https://img.icons8.com/material-sharp/17/000000/bell.png"/> : null}</div>)}
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

    if (chattingWith) {
        return (
            <div id="chatWindow">
                <MessageDisplay currentConversation={currentMessages} username={username} />
                <form onSubmit={handleSubmit}>
                    <input id="messageTextbox" type="text" placeholder={"Message to " + chattingWith} onChange={(e) => setCurrentMessage(e.target.value)}></input>
                    <input id="sendMessage" type="submit" value="Send"></input>
                </form>
            </div>
        )
    }

    return <div id="emptyChatWindow"><p>Choose someone to chat with</p></div>
}

function MessageDisplay({ currentConversation, username }) {
    return (
        <div id="messageDisplay">
            {currentConversation.map((message, i) =>
                <div className="message" key={i}>
                    <div className="sender">{message.sender === username ? 'You' : message.sender}</div>
                    <TimeAgo className="timestamp" date={message.timestamp} minPeriod={15}/>
                    <div className="messageBody">{message.body}</div>
                </div>
            )}
        </div>
    )
}

export default Chat;