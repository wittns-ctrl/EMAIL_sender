import dotenv from 'dotenv'
dotenv.config()
import redis from 'ioredis';
import APIError from '../utils/class.js'

export const Redis = new redis({
    host: process.env.HOST,
    port: process.env.PORT
})

Redis.on("connect",()=>{
    console.log("redis server connected successfully")
})
Redis.on("error",(err)=>{
    console.error("redis connection error:",err.message)
})

export default Redis