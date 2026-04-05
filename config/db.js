import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
export const connectDB = async()=>{
    try{
    const connection = await mongoose.connect(process.env.MONGODB_URI)

    if(connection){
        console.log("mongodb connected successfully")
    }
    }catch(error){
        console.error("Db connection error",error.message)
        process.exit(1)
    }
}
export default connectDB;