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
            subject: "Welcome message",
            text: `Welcome to our KIT Venue Booking, your account is created: ${user._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
                            <h1>Welcome to Super Bot!</h1>
                        </div>
                        <div style="padding: 20px; color: #333;">
                            <p>Hi there,</p>
                            <p>We're excited to have you on board! Your account has been successfully created.</p>
                            <p><strong>User ID:</strong> ${user._id}</p>
                            <p>Start exploring and have fun using our bot-powered services.</p>
                            <br/>
                            <p style="font-size: 14px; color: #888;">If you have any questions, just reply to this email.</p>
                        </div>
                        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                            &copy; ${new Date().getFullYear()} KIT Venue Booking. All rights reserved.
                        </div>
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
            subject: "Email verification OTP",
            text: `Your OTP is ${otp}. Verify your account using that OTP`
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
            subject: "Reset OTP for password",
            text: `Reset OTP is ${otp}. Reset your password within 10 minutes.`
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
