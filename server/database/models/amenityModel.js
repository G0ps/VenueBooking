import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
    amenity_name : {
        type : String,
        required : true
    },
    checkList : {
        type : [String],
        required : true
    }
});
//cascaded to amenity Insatnces model
amenitySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await amenityInstanceModel.deleteMany({ amenity_id: doc._id });
  }
});
//will be triggered if and only if findOneAndDelete of findByIdAndDelete is executed

const amenityModel = mongoose.model('amenity' , amenitySchema);

export default amenityModel;