import React from 'react'
import './Login.css' // Assuming you have a CSS file for styling
import { Link} from 'react-router-dom'
import {useState , useEffect} from 'react'
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    function handleclick() {
        console.log('Username:', username);
        console.log('Password:', password);
        
        // Reset the form fields after submission
        setUsername('');
        setPassword('');
    }
  return (
    <div className='login-container'>
    <div className="wrapper1">
        <form action="">
            <h1>Login</h1>
            <div className="input-box">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-box">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox" />Remember me </label>
                <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" onClick={() => handleclick()}>Login</button>

            <div>
                <p className="register">Don't have an account click sign up? <Link to='/register'>sign up</Link> </p>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Login