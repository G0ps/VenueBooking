import express from "express"
import { login, logout, register, sendVerifyOtp, verifyEmail , isAuntheticated , sendResetOtp, resetPassword } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";


const authRouter = express.Router();

authRouter.post('/register' , register);
authRouter.post('/login' , login);
authRouter.post('/logout' , logout);

authRouter.post('/sendVerifyOtp' , userAuth , sendVerifyOtp);
authRouter.post('/verifyAccount' , userAuth , verifyEmail);
authRouter.post('/is-auth' , userAuth , isAuntheticated);

authRouter.post('/send-reset-otp' , sendResetOtp);
authRouter.post('/resetPassword' , resetPassword);

export default authRouter;
