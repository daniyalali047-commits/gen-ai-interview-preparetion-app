import mongoose from 'mongoose';

const blackListTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        Required:[true , "Token Is added in Blacklist"]
    }
} , {
    timestamps:true
})

const tokenBlackListModel  = mongoose.model("blacklisttoken" , blackListTokenSchema);

export default tokenBlackListModel;