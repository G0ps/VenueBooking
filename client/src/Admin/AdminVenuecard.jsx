import React from 'react'

function AdminVenuecard() {
  return (
    <div>
        <div className='Venue-card'>
            <p>Venue Name</p>
            <p>Capacity</p>
            <p>Block Details</p>
            <p>Inbuilt Aminities</p>
            <div className='d-flex justify-content-between Venue-card-buttons'>

                <button >Update</button>
                <button >Delete</button>
            </div>
        </div>

    </div>
  )
}

export default AdminVenuecard