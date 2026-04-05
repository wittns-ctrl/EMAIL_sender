import register from '../contorllers/authController.js'
import express from 'express'
export const router = express.Router()

router.route('/register')
.post(register)

export default router
