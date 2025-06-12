import React from 'react'
import './RegisterForm.css' // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"
function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    function handleclick() {
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Contact:', contact);       
        console.log('Date of Join:', date);

        axios.post(`${import.meta.env.VITE_URL}api/auth/register` , {
            "name" : username,
            "password" : password,
            "email" : email,
            "contactNumber":contact
        },{
            withCredentials: true,
        }).then(res => console.log(res))
        .catch(err => console.log(err.message));
        // Reset the form fields after submission   
        setUsername('');
        setEmail('');
        setPassword('');
        setContact('');
        setDate('');
    }

  return (
    <div className='register-container'>
    <div className="wrapper">
        <form action="">
            <h1>Register</h1>
            <div className="input-box">
                <input type="text" placeholder="Username" value={username} onChange ={(e)=> setUsername(e.target.value)} required />
            </div>
            <div className="input-box">
                <input type="text" placeholder="E-mail id "  value={email} onChange={(e)=> setEmail(e.target.value)} required />
            </div>
            <div className="input-box">
                <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
            </div>
            <div className="input-box">
                <input type="number" placeholder="Contact number" value={contact} onChange={(e)=> setContact(e.target.value)} required />
            </div>
            <div className="input-box">
                <input type="date" placeholder="Date of Join" value={date} onChange={(e)=> setDate(e.target.value)} required />
            </div>

            <button type="submit" onClick={ () => handleclick()}>Register Now</button>

            <div>
                <p className="register">Do you have already account click sign in? <Link to='/'>sign in</Link></p> 
            </div>
        </form>
    </div>
    </div>
  )
}

export default Register