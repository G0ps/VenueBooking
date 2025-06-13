import mongoose from "mongoose"
import {v4 as UUIDV4} from "uuid"

const userSchema = new mongoose.Schema({
    name : {type:String , required : true},
    email: {type:String , required : true , unique: true},
    password: {type:String , required : true},
    contactNumber:{type:String , required:true},
    role:{type : String, enum:['FACULTY' , 'PRINCIPAL' , 'USER'] , default : 'USER'},
    joiningDate : {type : Date , deafult : Date.now},

    isEmailVerified : {type:Boolean , default:false},
    verificationOtp:{type:String , default : ""},
    verifyOtpExpireAt:{type:Number , default : 0},

    resetOtp:{type:String , default : ""},
    resetOtpExpireAt:{type:String , default : ""}
});

const userModel = mongoose.models.userModel || mongoose.model('user' , userSchema);

export default userModel;


