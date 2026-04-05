import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import express from 'express'
import router from './routes/authRoutes.js'
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

connectDB()

app.use('/api',router)
app.use(errorHandler)

app.listen(PORT, ()=> {
    console.log(`server running on PORT ${PORT}`)
})