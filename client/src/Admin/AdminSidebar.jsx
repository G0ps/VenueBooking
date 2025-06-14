import React from 'react';

function AdminSidebar({ onSelect }) {
  return (
    <div className='bg-primary Sidebar gap-4 d-flex flex-column'>
      <div className='VenueBooking'>VenueBooking</div>
      <div className='gap-3 d-flex flex-column align-items-center justify-content-center'>
        <div className="value" onClick={() => onSelect('add-users')}>Add Users</div>
        <div className="value" onClick={() => onSelect('view-users')}>View Users</div>
        <div className="value" onClick={() => onSelect('add-venues')}>Add Venues</div>
        <div className="value" onClick={() => onSelect('view-venues')}>View Venues</div>
        <div className="value" onClick={() => onSelect('add-amenities')}>Add Amenities</div>
        <div className="value" onClick={() => onSelect('view-amenities')}>View Amenities</div>
        <div className="value" onClick={() => onSelect('profile')}>Admin Profile</div>
      </div>
    </div>
  );
}

export default AdminSidebar;
