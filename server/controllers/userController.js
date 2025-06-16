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
export const getAllUserAdmin = async(req , res) => {
    const {role , userId} = req.body;

    console.log("All User request called");
    if(role === "ADMIN")
        {
            console.log("All User request accepted");
        try{
            const allUsers = await userModel.find();
            return res.json({success : true , usersData : allUsers});
        }catch(error){
            return res.json({success : false,message : error.message});
        }
    }
    else {return res.json({success : false , message : "This request is only for admin"})} 
}

export const deleteUserAdmin = async(req , res) => {
    const {role , deleteId} = req.body

    if(!deleteId)
    {
        return res.json({success : false , message : "Delete id is required"});
    }

    console.log("Delete User request called");
    if(role === "ADMIN")
    {
        try{
            const deletedUser = await userModel.findOneAndDelete({_id : deleteId});
            if (!deletedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.json({sucess : true , message : "Deleted Successfully"})
        }catch(error) {
            return res.json({success : false , message : error.message});
        }
    }else{
        return res.json({success: false , message : "Role is not Matching"});
    }
}
