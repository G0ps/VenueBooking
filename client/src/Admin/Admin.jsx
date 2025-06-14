import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminKarpagam from './AdminKarpagam';
import AdminSidebar from './AdminSidebar'; 
import Adminlogo from './Adminlogo';
import Adduser from './Adduser';
import './Admin.css';
// Dummy components to render (replace with your real components)
// import AddUsers from './AddUsers';
// import ViewUsers from './ViewUsers';

function Admin() {
  const [res, setRes] = useState(null);
  const [activeComponent, setActiveComponent] = useState('dashboard');

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

  const renderComponent = () => {
    switch (activeComponent) {
      // case 'add-users': return <AddUsers />;
      case 'view-users': return <div>Welcome to Admin view users</div>;
      case 'add-users' : return <div><Adduser/></div>;
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
