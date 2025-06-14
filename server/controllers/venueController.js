import venueModel from "../database/models/venueModel.js";

// add venue middle ware
export const addVenue = async (req , res , next) => {
    const {venue_name , capacity , manager_id , amenityInstances} = req.body;
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
        if(amenityInstances)
            {
                newVenue.inBuiltAmenityData = amenityInstances;
            }
        await newVenue.save();
        return res.json({success : true , message : "New Venue Saved"});
    }catch(error)
    {
        return res.json({success : false , error : error.message});
    }
}

//delete venue
export const deleteVenue = async (req , res) => {
    const {venueId} = req.body;

    if(!venueId)
    {
        return res.json({sucess : false , message : "VenueId missing"});
    }

    try{
        await venueModel.findOneAndDelete({_id : venueId});
        return res.json({success : true , message : "Done deleting"});
    }catch(error){return res.json({success : false , error : error.message})};
}



