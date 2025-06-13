import mongoose from "mongoose"

const venueSchema = new mongoose.Schema({
    venue_name : {
        type : String,
        required : true 
    },
    capacity : {
        type : Number ,
        required : true
    },
    blockName : {
        type : String,
        required : true,
        default : "none"
    },
    manager_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user"
    }
});

const venueModel = mongoose.model('venue' , venueSchema);
export default venueModel;