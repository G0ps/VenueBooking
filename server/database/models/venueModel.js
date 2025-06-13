import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  venue_name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  block_name: {
    type: String,
    default: null, // Use `null` so partial indexes work correctly
  },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  }
});
venueSchema.index({ venue_name: 1, block_name: 1 }, { unique: true, sparse: true });

const venueModel = mongoose.model("venue", venueSchema);
export default venueModel;
