import mongoose from "mongoose";

const amenityInstanceSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
     workingCondition : {
        type : Boolean,
        default : true
     },
     incharge_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "userModel"
     },
     description : {
        type : String,
        required : true
     }
});

const amenityInstanceModel = mongoose.model('amenity_instance' , amenityInstanceSchema);