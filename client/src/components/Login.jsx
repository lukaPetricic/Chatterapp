import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({username, setUsername, login}) {
    
    return (
        <>
            <h1>Login page</h1>
            <form>
                <input type="text" onChange={e => setUsername(e.target.value)}/>
                <Link to={'/chat'}>
                    <button onClick={() => login()}>Submit</button>
                </Link>
            </form>
        </>
    )
}

export default Login;