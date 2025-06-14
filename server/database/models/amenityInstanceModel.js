import mongoose from "mongoose";

const amenityInstanceSchema = new mongoose.Schema({
    
      amenity_id : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "amenity"
         },
      data: {
         type: Map,
         of: new mongoose.Schema({
            condition : {type : Boolean  , default : true},
            Availability : {type : String , enum : ["Taken" , "Available" , "Viewed"] , default : "Available"},
            description : {type : String}
         }),
         required: true
      }
   
});

export const amenityInstanceModel = mongoose.model('amenity_instance' , amenityInstanceSchema);