import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
import {Worker} from 'bullmq'
import REDIS from '../config/redis.js'

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.APP_PASSWORD
        }
    })
const emailWorker = new Worker('email-queue',async(job)=>{
  const {to,subject,body} = job.data;
  console.log(`processing job ${job.id} for ${to}`)

    const mailOptions = {
        from :process.env.EMAIL,
        to,
        subject,
        text: body,
        replyTo: process.env.EMAIL
    }
    await transporter.sendMail(mailOptions)
    return{status: 'sent'}
},
{
    connection:REDIS,
    concurrency: 10
}
)

emailWorker.on('failer',(job,err)=>{
    console.error(`rror on ${job.id}`,err.message)
})




