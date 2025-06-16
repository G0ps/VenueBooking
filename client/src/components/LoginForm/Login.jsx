import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Flag to trigger useEffect

  useEffect(() => {
    if (!isSubmitted) return;

    const login = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_URL}api/auth/login`, {
          email: username,
          password: password
        }, {
          withCredentials: true
        });

        const token = res.data.token;
        if (token) {
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          const role = decoded.role;

          if (role === 'ADMIN') {
            navigate('/admin');
          } else if (role === 'MANAGER' || role === 'USER') {
            navigate('/manager');
          }
        } else {
          setError("Login failed: No token received");
        }
      } catch (err) {
        console.error("Login error:", err.message);
        setError("Invalid username or password");
      } finally {
        setIsSubmitted(false); // Reset flag
      }
    };

    login();
  }, [isSubmitted]); // Effect triggers on form submission

  function handleClick(e) {
    e.preventDefault();
    setError('');

    if (username && password) {
      setIsSubmitted(true); // Trigger useEffect
    } else {
      setError('Please fill all fields');
    }
  }

  return (
    <div className='login-container'>
      <div className="wrapper1">
        <form onSubmit={handleClick}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Email id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Login</button>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <div>
            <p className="register">Don't have an account? <Link to='/register'>Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}``

export default Login;
