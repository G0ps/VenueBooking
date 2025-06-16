import React, { useState } from 'react';
import axios from 'axios';

function Admincard({
  id,
  name,
  role,
  email,
  contactNumber,
  selectedId,
  setSelectedId,
}) {
  const isEditing = selectedId === id;

  // Local state for editing
  const [editData, setEditData] = useState({
    name,
    email,
    contactNumber,
    role,
  });

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_URL}api/user/data/update`, {
        token: localStorage.getItem('token'),
        updateId: id,
        ...editData,
      });

      console.log("Updated successfully:", res.data);
      setSelectedId(null); // Back to normal view
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handledelete = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_URL}api/user/data/delete`, {
        data: {
          token: localStorage.getItem('token'),
          deleteId: id,
        },
      });

      console.log("Deleted successfully:", res.data);
      setSelectedId(null); // Back to normal view
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div
      className="admincard-wrapper"
      style={{
        transform: isEditing ? 'scale(1.5)' : 'scale(1)',
        filter: selectedId && !isEditing ? 'blur(3px)' : 'none',
        zIndex: isEditing ? 10 : 1,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        fontSize: isEditing ? '10px' : '1rem',
      }}
    >
      <div className="admincard">
        <div className={`cardimg ${isEditing ? 'editing' : ''}`}>
            <img src="/src/components/LoginForm/from1.jpg" alt="" />
        </div>


        <div className="cardcontent">
          {isEditing ? (
            <>
               <style>
                {`
                    input {
                    position: relative;
                    left : 10px
                    top: 10px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    font-size: 14px;
                    height: 30px;
                    width: 90%;
                    box-sizing: border-box;
                    padding: 5px;
                    transition: border-color 0.3s ease;
                    gap: 5px;
                    }
                    .cardcontent {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    margin-top: 15px;
                    }
                }
                `}
               </style>
              <input value={editData.name} onChange={(e) => handleChange('name', e.target.value)} />
              <input value={editData.email} onChange={(e) => handleChange('email', e.target.value)} />
              <input value={editData.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} />
              <input value={editData.role} onChange={(e) => handleChange('role', e.target.value)} />
            </>
          ) : (
            <>
              <span>{name}</span>
              <span>{role}</span>
            </>
          )}
        </div>

        <div className="cardbutton">
          {isEditing ? (
            <>
               <style>
                    {`
                        .admincard .cardbutton button {
                        position: relative;
                        top: 6px;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        font-size: 12px;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        background-color: #007bff;
                        }

                        .admincard .cardbutton button:hover {
                        background-color: rgb(248, 19, 3);
                        }
                    `}
                </style>

              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setSelectedId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setSelectedId(id)}>Edit</button>
              <button onClick={() => handledelete(id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admincard;
