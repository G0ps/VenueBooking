import mongoose from "mongoose"

const amenitySchema = new mongoose.Schema({
    venueId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "venue"
    },
    amenityInstanceId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'amenity_instance'
    }
});