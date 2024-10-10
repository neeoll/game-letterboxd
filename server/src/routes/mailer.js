import { Router } from "express"
import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config'
import User from "../db/models/User.js"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

const mailerRouter = Router()
  .get('/resendVerification-register', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })

      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15 minutes' })
      const mailOptions = {
        from: 'noreply@arcadearchive.com',
        to: user.email,
        subject: "Hello from Arcade Archive!",
        text: `Follow the link to verify your account\n${process.env.FRONTEND_URL}/verify-email?token=${token}`,
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error })
        } else {
          res.status(200).json({ message: info.response })
        }
      })

      res.status(200).json({ message: "Verification link resent", status: "ok" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get('/resendVerification-verify', async (req, res) => {
    try {
      const decodedToken = jsonwebtoken.decode(req.query.token)

      const user = await User.findOne({ _id: decodedToken.id })
      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15 minutes' })
      const mailOptions = {
        from: 'noreply@arcadearchive.com',
        to: user.email,
        subject: "Hello from Arcade Archive!",
        text: `Follow the link to verify your account ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error })
        } else {
          res.status(200).json({ message: info.response })
        }
      })

      res.status(200).json({ message: "Verification link sent", status: "ok" })
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .post('/sendPasswordResetLink', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({ error: "Invalid email" })
      }

      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15 minutes' })

      const mailOptions = {
        from: 'noreply@arcadearchive.com',
        to: user.email,
        subject: "Arcade Archive Password Reset",
        text: `Follow the link to reset your password:\n${process.env.FRONTEND_URL}/reset-password?token=${token}`,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error })
        } else {
          res.status(200).json({ message: info.response })
        }
      })

      res.status(200).json({ message: "Password reset link sent", status: "ok" })
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default mailerRouter