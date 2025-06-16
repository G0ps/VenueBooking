import express from 'express'
import { userAuth, verifyAdmin } from '../middleware/userAuth.js';
import { deleteUserAdmin, getAllUserAdmin, getUserData } from '../controllers/userController.js';
import { register, updateUser } from '../controllers/authController.js';

const userRouter = express.Router();

userRouter.get('/data' , userAuth , getUserData);
userRouter.post('/data/all' , verifyAdmin , getAllUserAdmin);
userRouter.delete('/data/delete' , verifyAdmin , deleteUserAdmin);
userRouter.patch('/data/update' , updateUser);

export default userRouter;