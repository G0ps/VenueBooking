import React from 'react'
function Profile() {
  return (
    <div>
        <div className='position-fixed'>
        <div className=' profile justify-content-center align-items-center d-flex gap-2 ms-3'>
            <h1>Profile</h1>
        </div>
        <h3 className='ms-3'>Username</h3>
        <h3 className='ms-3'>dept</h3>
        <div className='d-flex flex-column gap-2 ms-3'>
        <div className="btn btn-primary">add blocks</div>
        <div className="btn btn-primary">Notifications</div>
        </div>
        </div>
        <div className='bottom-0 position-fixed ms-3 '>
            <h5>Settings</h5>
            <h5>logout</h5>
        </div>
    </div>
  )
}

export default Profile