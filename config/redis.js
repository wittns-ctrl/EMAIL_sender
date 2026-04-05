import dotenv from 'dotenv'
dotenv.config()
import redis from 'ioredis';

const Redis = new redis({
    host: process.env.HOST,
    port: process.env.PORT
})

Redis.on("connect",()=>{
    console.log("redis server connected successfully")
})
Redis.on("error",(err)=>{
    console.error("redis connection error:",err.message)
})