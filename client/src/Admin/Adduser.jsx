import React from 'react'
import { useState , useEffect} from 'react'
import axios from 'axios';
function Adduser() {
  const [username, setUsername] = useState('');
  const [email,setemail] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [contact,setcontactnumber] = useState('');
  const [date,setdate] = useState('');
  const [role,setrole] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
    function handleClick(e) {
    e.preventDefault();
    setError('');

    if (username && password) {
      setIsSubmitted(true); ('Please fill all fields');
    }

    axios.post(`${import.meta.env.VITE_URL}api/auth/register` , {
            "name" : username,
            "password" : password,
            "email" : email,
            "contactNumber":contact,
            "date": date,
            "role": role
        },{
            withCredentials: true,
        }).then(res => { 
            console.log(res.data);
        }).then()
    
  }
  return (
    <div className='admin-container '>
      <div className=" d-flux column gap-3 wrapper2">
        <form onSubmit={handleClick}>
          <h1>Add user</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

           <div className="input-box">
            <input
              type="text"
              placeholder="Email id"
              value={email}
              onChange={(e) => setemail(e.target.value)}
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

           <div className="input-box">
            <input
              type=" number"
              placeholder="contact number"
              value={contact}
              onChange={(e) => setcontactnumber(e.target.value)}
              required
            />
          </div>

           <div className="input-box">
            <input
              type="date"
              placeholder="Date of join"
              value={date}
              onChange={(e) => setdate(e.target.value)}
              required
            />
          </div>
            <div className="input-box">
                <select
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    required>
                    <option value="" disabled>Choose Role</option>
                    <option value="PRINCIPLE">PRINCIPLE</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="USER">USER</option>
                </select>
            </div>
            <button onClick={ (e) => handleClick(e)}>Add button</button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Adduser