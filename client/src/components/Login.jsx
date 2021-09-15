import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

function Login({ username, setUsername, login }) {
    const [authorized, setAuthorized] = useState(false)
    function handleLogin(e) {
        e.preventDefault();
        fetch('./isUsernameTaken/' + username)
            .then(response => response.json())
            .then(isTaken => {
                if (isTaken) {
                    alert('Think of something more original')
                } else {
                    setAuthorized(true)
                    login();
                }
            });
    }

    return (
            <div id="login">
                <h2>Choose a nickname</h2>
                <p>(be original)</p>
                <form>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                    <button onClick={(e) => handleLogin(e)}>Submit</button>
                </form>
                {authorized ? <Redirect to={'/chat'} /> : null}
            </div>
    )
}

export default Login;