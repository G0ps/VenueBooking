import amenityModel from '../database/models/amenityModel.js'
import {amenityInstanceModel} from '../database/models/amenityInstanceModel.js'
export const addAmenity = async(req , res) => {

    console.log("New Amenity Add request came in");

    const {amenity_name , checklist , description , newAmenityInstances} = req.body;

    if(!amenity_name)
    {
        return res.json({success : false , message: "Name Must and should be unique"});
    }
    try{
        const existingAmenity = await amenityModel.findOne({amenity_name});

    if(existingAmenity)
    {
        return res.json({success : false , message : "amenity already Exist , navigate to manage section to edit this amenity" , navigateId : existingAmenity._id});
    }

    const newAmenity = new amenityModel({
        amenity_name,
        checkList : ["Check Working Status" , ...checklist],
        description : description || null,
    });
    await newAmenity.save();

    if(newAmenityInstances)
    {
        // console.log("Amenity Instances : ",newAmenityInstances);
        console.log("With amenity instances enclosed");
        const newInstances = new amenityInstanceModel({
            amenity_id : newAmenity._id,
            data : newAmenityInstances
        });
        await newInstances.save();
    }

    console.log("Amenity Added Successfully");
    return res.json({success : true , message : "Amenity added"});
    }catch(err){return res.json({success : false , error : err.message});}
}