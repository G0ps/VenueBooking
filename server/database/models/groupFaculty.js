// user have several different ways of data .
//group faculty

import mongoose from "mongoose";

const groupFaculty = new mongoose.Schema({
    _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to User model
    required: true
  },
  isManager : {
    type : Boolean , 
    required : true
  },
  isIncharge :{
    type : Boolean , 
    required : true
  },
  isStaff : {
    type : Boolean , 
    required : true
  },
  //if staff
  collegeId : {
    type: String,
    unique: true,
    sparse: true, // ❗ Makes unique apply only when value is present
    default: null 
  },
  departmentId : {
    type : String , 
    default : null
  },

  //if Incharge
  managerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',      // must match your User model name
  default: null     // allows null values
}


} , {_id : false});