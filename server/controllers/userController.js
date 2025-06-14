import userModel from "../database/models/userModel.js"

export const getUserData = async(req , res) => {
    try{
        const {userId}  =req.body;

        const user = await userModel.findById(userId);

        if(!user)
        {
            return res.json({success : false , message : "User not found"});
        }

        return res.json({
            success : true , 
            userData : {
                name : user.name,
                isAccounVerified : user.isEmailVerified
            }
        });
    }
    catch(error)
    {
        return res.json({success : false , message : error.message})
    }
}