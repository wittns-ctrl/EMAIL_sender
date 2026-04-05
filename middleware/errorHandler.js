import dotenv from 'dotenv'
dotenv.config()

export const errorHandler = (err,req,res,next)=> {
    const statusCode = err.statusCode || 500
    const status = err.status

    res.status(statusCode).json({
        success: false,
        data: status,
        message: err.message,
        stack : process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

export default errorHandler;