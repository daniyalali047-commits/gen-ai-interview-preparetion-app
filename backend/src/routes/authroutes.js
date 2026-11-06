import { Router } from 'express';
import registerUserController from '../controllers/authcontroller.js';
import { loginusercontroller } from '../controllers/authcontroller.js';
import { logoutusercontroller } from '../controllers/authcontroller.js';
import authUser from '../middlewares/auth.middleware.js';
import {getMeController} from '../controllers/authcontroller.js';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description registering new user
 * @access Public
 */
authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with email and pass
 * @access public
 */

authRouter.post("/login" , loginusercontroller )

/**
 * @Route GET /api/auth/logout
 * @description logout user by clearing the cookie
 * @access public
 */

authRouter.get("/logout" , logoutusercontroller)

/**
 * @route GET /api/auth/get-me
 * @description get logged in user details
 * @access private
 */

authRouter.get("/get-me" , authUser , getMeController )

export default authRouter;
