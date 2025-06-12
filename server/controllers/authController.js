import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import userModel from '../database/models/userModel.js'
import transporter from '../mail/nodeMailer.js'

export const register = async(req , res) => {
    console.log("register action pulled");
    const {name , email , password , contactNumber} = req.body;

    if(!name || !email || !password || !contactNumber){
        res.json({success : "false" , message : "Missing Details"});
    }
    try{
        
        const existingUser =await userModel.findOne({email});

        if(existingUser)
        {
            res.json({success : false , message : "User Already Exist"});
        }

        const hashedPassword = await bcrypt.hash(password , 14);

        const user = new userModel({name , email , password : hashedPassword , contactNumber});
        await user.save();

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : '7d'});

        res.cookie('token' , token , {
            httpOnly: true,
            secure: false,         // set to true only if using HTTPS
            sameSite: 'Lax', 
            maxAge   : 7 * 24 * 60 * 60 * 1000 //ms expiry
        });
        //sending welcome email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject : "chumma welcome message",
            text : `welcome to our super bot website , your account is created ${user._id}`
        }

        await transporter.sendMail(mailOptions);
        return res.json({success : true , message : "mail sent"});

    }catch(error)
    {
        res.json({success : "false" , message : error.message});
    }
}

export const login = async(req , res) => {
    
    const {email , password} = req.body;

    if(!email || !password)
    {
        res.json({success : false , message : "Details Missing"});
    }

    try{

        const user = await userModel.findOne({email});

        if(!user)
        {
            res.json({success : false , message : "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch)
        {
            res.json({success : false , message : "INVALID PASSWORD"});
        }

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : '7d'});

        res.cookie('token' , token , {
            httpOnly: true,
            secure: true,         // set to true only if using HTTPS
            sameSite: "none", 
            maxAge   : 7 * 24 * 60 * 60 * 1000 //ms expiry
        });

        return res.json({success : true});

    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

export const logout = async(req , res) => {
    try{
        res.clearCookie('token' , {
            httpOnly: true,
            secure: false,         // set to true only if using HTTPS
            sameSite: 'Lax', 
        });

        return res.json({success : true , message : "LOGED OUT COOKIE REMOVED"});
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

export const sendVerifyOtp = async(req , res) => {
    try{
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isEmailVerified)
        {
            return res.json({success : true , message : "Account Already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random()*900000));

        user.verificationOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Email verification OTP",
            text : `your otp is ${otp} . verify your accout using that OTP`
        }

        transporter.sendMail(mailOption);

        return res.json({success : true , message : "otp sent to email enrolled"});

    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

//verify email using otp
export const verifyEmail = async(req , res) => {
    const {userId , otp} = req.body;

    if(!userId || !otp)
    {
        return res.json({success : false , message : "Missing details"});
    }

    try{
        const user = await userModel.findById(userId);

        if(!user)
        {
            return res.json({success : false , message : "User Not available"});
        }

        if(otp === "" || otp != user.verificationOtp)
        {
            return res.json({success : false , message : "Invalid Otp"});
        }

        if(user.verifyOtpExpireAt < Date.Now)
        {
            return res.json({success : false , message : "OTP expired"});
        }

        user.isEmailVerified = true;
        user.verificationOtp = "VERIFIED"
        user.verifyOtpExpireAt = 0

        await user.save();

        return res.json({success : true , message : "Email Verified Successfully"});
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

// is already authenticated
export const isAuntheticated = async(req , res) => {
    try{
        return res.json({success : true});
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

export const sendResetOtp = async(req , res) => {
    const {email} = req.body;

    if(!email)
    {
        return res.json({success : false , message : "Email not Provided"});
    }

    try{
        const user = await userModel.findOne({email : email});

        if(!user)
        {
            return res.json({success : false , message : "User not available"});
        }

        //generate otp
        const otp = String(Math.floor(100000 + Math.random()*900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Reset Otp for password",
            text : `reset OTP is ${otp} . reset your password with in ${Date.now() + 10 * 60 * 60 * 1000}`
        }

        await transporter.sendMail(mailOption);

        return res.json({success : true , message : "Reset OTP sent Successfully"});

    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}

//reset Password
export const resetPassword = async(req , res) => {
    const {email , otp , newPassword} = req.body;

    if(!email || !otp || !newPassword)
    {
        return res.json({success : false , message : "Email , otp , NewPassword are required"});
    }

    try{
        const user = await userModel.findOne({email});
        if(!user)
        {
            res.json({success : false , message : "User not found"});
        }

        if(user.resetOtp === "" || user.resetOtp != otp)
        {
            return res.json({success : false , message : "OTP verification failed"});
        }

        if(user.resetOtpExpireAt < Date.now())
        {
            return res.json({success : false , message : "OTP expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword , 15);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({success : true , message : "Details updated"});
    }catch(error)
    {
        res.json({success : false , message : error.message});
    }
}