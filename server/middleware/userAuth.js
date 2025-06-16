import jwt from "jsonwebtoken"

export const userAuth = async (req , res , next) => {
    console.log("user Authentication kicked off");
    const {token} = req.cookies;
    console.log(token);

    if(!token)
    {
        return res.json({success : false , message : "Not authorised login again"});
    }

    try{
        const tokenDecode = jwt.verify(token , process.env.JWT_SECRET);

        if(tokenDecode.id)
        {
            req.body.userId = tokenDecode.id;
        }
        else{
            return res.json({success : false ,message : "Unable find user , login again"});
        }

        next();
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

//verify admin
export const verifyAdmin = async (req , res , next) => {
    const token = req.body.token;
    console.log("Verify admin called");
    if(!token)
    {
        return res.json({success : false , message : "Not authorised login again"});
    }

    try{
        const tokenDecode = jwt.verify(token , process.env.JWT_SECRET);

        if(tokenDecode.id)
        {
            req.body.userId = tokenDecode.id;
            req.body.role   = tokenDecode.role;
        }
        else{
            return res.json({success : false ,message : "Unable find user , login again"});
        }

        next();
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}
