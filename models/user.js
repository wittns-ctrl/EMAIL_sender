import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    isValid:{
        type:Boolean,
        default: false
    }
},{timestamps:true})

export const User = mongoose.model('user',userSchema)

export default User