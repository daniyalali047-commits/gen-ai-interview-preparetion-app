import usermodel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import tokenBlackListModel from "../models/blacklist-model.js";

/**
@name registerusercontroller
 * @description registering new user we expect username , email and password in the body of the request
 * @access Public
 */

export default async function registerusercontroller(req, resp) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return resp.status(400).json({ message: "Please enter a valid email address" });
    }

    const normalizedEmail = email.trim();
    const isUserAlreadyExist = await usermodel.findOne({
      $or: [{ username: username }, { email: normalizedEmail }]
    });

    if (isUserAlreadyExist) {
      return resp.status(400).json({
        succes: false,
        message: "User already exist with the username or email"
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUserCreate = await usermodel.create({
      username: username,
      email: normalizedEmail,
      password: hashpassword
    });

    const token = jwt.sign(
      { id: newUserCreate._id, username: newUserCreate.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    resp.cookie("token", token, { httpOnly: true });

    return resp.status(201).json({
      message: "User created successfully",
      user: {
        id: newUserCreate._id,
        username: newUserCreate.username,
        email: newUserCreate.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return resp.status(500).json({
      message: "An error occurred during registration",
      error: error.message
    });
  }
}



/**
 * @name loginusercontroller
 * @description login user we expect email and password in the body of the request
 * @access Public
 */


export async function loginusercontroller(req , resp){
      const {email , password}=req.body;
      const user = await usermodel.findOne({email})
    
    //checking if user exist in db with the email address or not

    if(!user){
        return resp.status(400).json({
            success:false,
            message:"Invalid credentials"
        })
    }

    const isPasswordMatched =await bcrypt.compare(password , user.password)
    if(!isPasswordMatched){
        return resp.status(400).json({
            sucess:false,
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign(
 {id:user._id , username: user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
    )

    resp.cookie("token" , token)
    resp.status(200).json({
        message:"User logged in sucessfully",
    user:{
     id:user._id,
     username:user.username,
     email:user.email
    }
    })
}

/**
 * @name logoutusercontroller
 * @description logout user by clearing the token cookie
 * @access Public
 */

export async function logoutusercontroller(req , resp){
  const token = req.cookies.token
  if(token){
  await tokenBlackListModel.create({token})
}

resp.clearCookie("token")

resp.status(200).json({
  message:"User logged out successfully"
})
}

/**
 * @name getMeController
 * @description get logged in user details
 * @access Private
 */

export async function getMeController(req , resp){
  const user = await usermodel.findById(req.user.id)
  resp.status(200).json({
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })
}