import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminKarpagam from './AdminKarpagam';
import AdminSidebar from './AdminSidebar'; 
import Adminlogo from './Adminlogo';
import Adduser from './Adduser';
import Admincard from './Admincard';
import './Admin.css';

function Admin() {
  const [res, setRes] = useState(null);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [selectedCardId, setSelectedCardId] = useState(null);


  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}api/auth/verifyAdmin`,
          {
            headers: { 'Content-Type': 'application/json' },
            token: localStorage.getItem('token'),
          },
          { withCredentials: true }
        );

        setRes(response.data.success);
      } catch (err) {
        console.error("Error verifying admin:", err);
        setRes(false);
      }
    };

    verifyAdmin();
  }, []);

  // display the cards in the veiw user
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}api/user/data/all`,
          {
            headers: { 'Content-Type': 'application/json' },
            token: localStorage.getItem('token'),
          },
          { withCredentials: true }
        );
        // Handle the response data as needed
        console.log("Fetched users:", response.data);
        setUsers(response.data.usersData);
        // setUsers(prevUsers => prevUsers.filter(user => user.role !== 'ADMIN'));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'add-users' : return <div><Adduser/></div>;
      case 'view-users': return <div className='admin-card-container'>{users.map((user) => (
          <Admincard key={user._id} name={user.name} role={user.role} id ={user._id} selectedId={selectedCardId}
          setSelectedId={setSelectedCardId} email = {user.email} contactNumber={user.contactNumber} />
        ))}</div>;
      case 'add-venues' : return <div>Welcome to Admin Add Venues</div>;
      case 'view-venues' : return <div>Welcome to Admin View Venues</div>;
      case 'add-amenities' : return <div>Welcome to Admin add amenities</div>;
      case 'view-amenities' : return <div>Welcome to Admin View amenities</div>;
      default: return <div>Welcome to Admin Dashboard</div>;
    }
  };

  if (res === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      {res ? (
        <div>
          <AdminKarpagam />
          <Adminlogo />
          <AdminSidebar onSelect={setActiveComponent} />
          <div className="admin-content">
            {renderComponent()}
          </div> 
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
