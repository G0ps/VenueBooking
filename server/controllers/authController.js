import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import userModel from '../database/models/userModel.js'
import transporter from '../mail/nodeMailer.js'

export const register = async (req, res) => {
    console.log("register action pulled", req.body);
    const { name, email, password, contactNumber, date } = req.body;
    const role = req.body.role || "USER";

    if (!name || !email || !password || !contactNumber) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 14);

        const user = new userModel({ name, email, password: hashedPassword, contactNumber, joiningDate: date, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to KIT Venue Booking!",
            text: `Welcome to KIT Venue Booking! Your account has been created. Your User ID is: ${user._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4CAF50; text-align: center;">Welcome to KIT Venue Booking 🎉</h2>
                    <p>Hi ${user.name || 'there'},</p>
                    <p>We're excited to have you with us! Your account has been successfully created.</p>
                    
                    <p><strong>Your User ID:</strong></p>
                    <div style="font-size: 16px; font-weight: bold; background-color: #f9f9f9; padding: 10px; border-radius: 5px; display: inline-block;">
                        ${user._id}
                    </div>

                    <p style="margin-top: 20px;">You can now start booking venues and managing events easily through our platform.</p>

                    <p style="font-size: 14px; color: #888;">If you have any questions, feel free to reach out to our support team.</p>

                    <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply directly to this email.</p>

                    <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 10px; text-align: center; font-size: 12px; color: #aaa;">
                        &copy; ${new Date().getFullYear()} KIT Venue Booking. All rights reserved.
                    </div>
                </div>
            `
        };


        await transporter.sendMail(mailOptions);
        console.log("mail sent");
        return res.json({ success: true, message: "mail sent" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("login statement asked", req.body);
    if (!email || !password) {
        return res.json({ success: false, message: "Details Missing" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "INVALID PASSWORD" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, token });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        });

        res.json({ success: true, message: "LOGED OUT COOKIE REMOVED" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (user.isEmailVerified) {
            return res.json({ success: true, message: "Account Already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verificationOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Email Verification OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4CAF50;">Verify Your Email</h2>
                <p>Hello ${user.name || "User"},</p>
                <p>Your OTP code is:</p>
                <div style="font-size: 24px; font-weight: bold; background-color: #f9f9f9; padding: 10px; border-radius: 5px; display: inline-block;" id="otp-value">${otp}</div>
                <br><br>
                <button style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;"
                        onclick="navigator.clipboard.writeText('${otp}')">
                    Copy OTP
                </button>
                <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
            </div>
        `
    };


        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "OTP sent to email enrolled" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User Not available" });
        }

        if (otp === "" || otp != user.verificationOtp) {
            return res.json({ success: false, message: "Invalid Otp" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        user.isEmailVerified = true;
        user.verificationOtp = "VERIFIED";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Email Verified Successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const isAuntheticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email not Provided" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not available" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Reset OTP for Password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #E53935;">Password Reset Request</h2>
                <p>We received a request to reset your password. Use the OTP below to proceed:</p>

                <input type="text" value="${otp}" readonly
                    style="font-size: 20px; padding: 10px; width: 100%; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;" />

                <p style="font-size: 14px; color: #555;">Reset your password within <strong>10 minutes</strong>.</p>

                <p style="font-size: 12px; color: #999;">If you didn’t request a password reset, you can safely ignore this email.</p>
            </div>
        `
    };


        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "Reset OTP sent Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and NewPassword are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp != otp) {
            return res.json({ success: false, message: "OTP verification failed" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 15);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Details updated" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const updateUser = async(req , res) => {
    console.log("update request sent ");
                const {name , email , contactNumber , role} = req.body;
                const existingUser = await userModel.findOne({email});
                if(!existingUser)
                {
                    return res.json({success : false , message : "User Not Found"});
                }
                try{
                    Object.keys(req.body).forEach((key) => {
                            existingUser[key] = req.body[key];
                    });
                    await existingUser.save();
                    const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: email,
                    subject: "Your Account Has Been Updated",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #1976D2;">Account Update Notification</h2>
                            <p>Hi ${name || 'User'},</p>
                            <p>This is to inform you that your account details have been successfully updated.</p>
                            <p><strong>Updated Details:</strong></p>
                            <ul style="line-height: 1.6;">
                                <li><strong>Name:</strong> ${name}</li>
                                <li><strong>Email:</strong> ${email}</li>
                                <li><strong>Contact Number:</strong> ${contactNumber}</li>
                                <li><strong>Role:</strong> ${role}</li>
                            </ul>
                            <p>If you did not request this update, please contact our support team immediately.</p>
                            <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply to this email.</p>
                        </div>
                    `
                };

                    await transporter.sendMail(mailOptions);
                    return res.json({success : true , message : "User updated successfully"});
                }catch(error){
                    return res.json({success : false , error : error.message});
                }
                
}
