import React from 'react';

function AdminSidebar({ onSelect }) {
  return (
    <div className='Sidebar gap-4 d-flex flex-column'>
      <div className='VenueBooking'>
        <img src="\src\Admin\assects\venue.png" alt="venue image" />
        <p> Booking</p>
      </div>
      <div className='valuecontainer gap-3 d-flex flex-column align-items-center justify-content-center'>
        <div className="value" onClick={() => onSelect('add-users')}><i class="bi bi-plus-circle-fill"></i>Add Users</div>
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
