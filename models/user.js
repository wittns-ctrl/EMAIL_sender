import mongoose from "mongoose"
import crypto from "crypto"

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
    },
    PasswordResetToken: String,
    PasswordResetExpires: Date,
},{timestamps:true})

userSchema.methods.createPasswordResetToken = function (){

const resetToken = crypto.randomBytes(32).toString('hex')

this.PasswordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

this.PasswordResetExpires = Date.now()+10*60*1000

return resetToken;
}

export const User = mongoose.model('user',userSchema)

export default User