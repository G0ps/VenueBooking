import venueModel from "../database/models/venueModel.js";

// add venue
export const addVenue = async (req , res) => {
    const {venue_name , capacity , manager_id} = req.body;
    const block_name = req.body.block_name || "GENERAL-BLOCK";

    if(!venue_name || (!capacity || capacity <= 0)  || !manager_id)
    {
        return res.json({success : false , message : "Data not Valid or Incomplete"});
    }

    try{

        const newVenue = new venueModel({
            venue_name,
            capacity,
            block_name,
            manager_id
        });
        await newVenue.save();

        return res.json({success : true , message : "New Venue Saved"});
    }catch(error)
    {
        return res.json({success : false , error : error.message});
    }
}
