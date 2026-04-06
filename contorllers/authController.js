import bcrypt from 'bcrypt'
import crypto from 'crypto'
import axios from 'axios'
import {promises as dns} from 'dns'
import User from '../models/user.js'
import validator from 'validator'
import APIError from '../utils/class.js'
import Redis from '../config/redis.js'
import emailqueue from '../config/emailQueue.js'

export const register = async(req,res)=> {
    const {email,password} = req.body;
    try{
    const email_Valid = validator.isEmail(email)
    if(!email_Valid){
        throw  new APIError("wrong email synthax",400)
    }

    const domain = email.split("@")[1]
    const records = await dns.resolveMx(domain)

    if(records.length === 0){
        throw new APIError("domain not does not contain mx records",400)
    }

    const apikey = process.env.MAILBOXLAYERAPIKEY
    const url = `https://apilayer.net/api/check?access_key=${apikey}&email=${email}`
    const datum = await axios.get(url)
    if(datum.data.mx_found && datum.data.smtp_check){

    const hashedPassword = await bcrypt.hash(password,10);
    const otp = crypto.randomInt(100000,999999).toString()

    const userData = JSON.stringify({password:hashedPassword,otp})

    await Redis.set(`otp:${email}`,userData,'EX',300)

    await emailqueue.add('otp message',{
        to:email,
        subject:"OTP message",
        body:otp
    },
    {
        attemps: 3,
        backoff: {type: 'exponential', delay: 1000}
    }
)

    res.status(202).json({message:"check OTP send to your email "})
    }
    else {
        throw new APIError("email verification failed via API",404)
    }

    }catch(error){
    throw new APIError("verification error",500)
    }
}



export const verifyotp = async(req,res)=>{
    try{
    const {email,otp} = req.body;

    const cached = await Redis.get(`otp:${email}`)
    
    if(!cached){
        throw new APIError("OTP expired or invalid email,please sign up again", 404)
    }

    const{password:hashedpassword,otp: storedOtp} = JSON.parse(cached)

    if(otp !== storedOtp){
        throw new APIError("incorrect OPT,please sign up again",404)
    }

    const newUser = await User.create({
        email,
        password: hashedpassword,
        isValid: true
    })

    await Redis.del(`otp:${email}`)

    res.status(201).json({success: true,user:newUser})
}catch(error){
    throw new APIError(error.message,400)
}
}


export const forgotPassword = async(req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email})
    try{
    
     if(!user){
        throw new APIError("user not found, please sign up",404)
     }
     const resetToken = user.createPasswordResetToken()

     await user.save({validateBeforeSave : false})

     const url = `${req.protocol}://${req.get('host')}/api/resetPassword/${resetToken}`

     await emailqueue.add('reset password',{
        to:email,
        subject:'reset password',
        body:url
     },
    
    {
        attempts: 3,
        backoff: {type: 'exponential', delay:1000}
    })

     res.status(201).json({message: "link send via email successfully"})
    }catch(error){
        user.PasswordResetToken = undefined
        user.PasswordResetExpires = undefined

        await user.save({validateBeforeSave : false})
        res.status(500).json({message: error.message})
        console.error("forgot password error :",error.message)
    }
}


export const resetPassword = async(req,res)=>{
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
    PasswordResetToken: hashedToken,
    PasswordResetExpires: { $gt: Date.now()}
    })
    try{
        if(!user){
            throw new APIError("time expired , go back to forgot password",404)
        }
    user.password = password

   user.PasswordResetExpires = undefined
   user.PasswordResetToken = undefined

   await user.save()

   res.status(200).json({message:"account verified successfully"})
    }catch(error){
        user.PasswordResetExpires = undefined
        user.PasswordResetToken = undefined
        console.log("resetpassword error:",error.message)
        res.status(500).json({message:error.message})
    }
}