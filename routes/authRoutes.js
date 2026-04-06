import {register,verifyotp,forgotPassword} from '../contorllers/authController.js'
import express from 'express'
export const router = express.Router()

router.route('/register')
.post(register)
router.route('/verify')
.post(verifyotp)
router.route('/forgot')
.post(forgotPassword)

export default router
