import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    username:{
        type:"String",
        unique:[true, "User name already taken"],
        required:true
    },
    email:{
        type:"String",
        unique:[true, "Account already exist with this email"],
        required:true,
        trim:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password:{
        type:"string",
        required:true
    }
})

const usermodel = mongoose.model("users" , userSchema)

export default usermodel