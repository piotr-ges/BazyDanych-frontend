import React from 'react';
import './Login.css'; // Importujemy wspólny plik CSS

const Login = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className='btn btn-primary'>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;