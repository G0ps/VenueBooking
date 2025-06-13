import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    checkList : {
        type : [String],
        required : true,
        default : "NULL"
    }
});

const amenityModel = mongoose.model('amenity' , amenitySchema);

export default amenityModel;