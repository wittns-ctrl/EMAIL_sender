import {register,verifyotp,forgotPassword,resetPassword} from '../contorllers/authController.js'
import express from 'express'
export const router = express.Router()

router.route('/register')
.post(register)
router.route('/verify')
.post(verifyotp)
router.route('/forgot')
.post(forgotPassword)
router.route('/resetPassword/:token')
.post(resetPassword)

export default router
