import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [res, setRes] = useState(null); // null → loading, true → success, false → denied

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}api/auth/verifyAdmin`, {
          
          headers: {
            'Content-Type': 'application/json'
          },
          token : localStorage.getItem('token')
        },{
          withCredentials: true
        }
      );

        setRes(response.data.success);
      } catch (err) {
        console.error("Error verifying admin:", err);
        setRes(false);
      }
    };

    verifyAdmin();
  }, []); // run only once when component mounts

  if (res === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      {res ? (
        <div>
          <h1>Welcome to Admin Page</h1>
          <p>You have admin privileges.</p>
        </div>
      ) : (
        <div>
          <h1>Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      )}
    </div>
  );
}

export default Admin;
