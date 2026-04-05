import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
import APIError from '../utils/class.js'

export const sendEmail = async(Email,otp) => {
try{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.APP_PASSWORD
        }
    })

    const mailOptions = {
        from :process.env.EMAIL,
        to :Email,
        subject: "otp verification code",
        text: `YOUR OTP IS ${otp}`,
        replyTo: process.env.EMAIL
    }

    await transporter.sendMail(mailOptions)
}catch(error){
  throw  new APIError("we have problems with sending email",500)
}
}

export default sendEmail
