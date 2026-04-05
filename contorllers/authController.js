import bcrypt from 'bcrypt'
import crypto from 'crypto'
import axios from 'axios'
import {promises as dns} from 'dns'
import User from '../models/user.js'
import validator from 'validator'
import APIError from '../utils/class.js'
import Redis from '../config/redis.js'
import sendEmail from '../services/emailService.js'

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

    await sendEmail(email,otp)

    res.status(200).json({message:"check OTP send to your email "})
    }
    else {
        throw new APIError("email verification failed via API",404)
    }

    }catch(error){
    throw new APIError("registration error:",error.message)
    }
}

export default register