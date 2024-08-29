import { Router } from "express"
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import axios from "axios"
import 'dotenv/config'
import User from "../db/models/User.js"
import { verifyToken } from "../middleware/verifyToken.js"
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

const authRouter = Router()
  .get('/checkAuthentication', async (req, res) => {
    try {
      if (req.cookies.accessToken) {
        return res.status(200).json(true)
      } else {
        return res.status(200).json(false)
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
    
  })
  .post('/verifyCaptcha', async (req, res) => {
    const { captchaValue } = req.body
    const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`)
    res.status(200).json({ data })
  })
  .post("/register", async (req, res) => {
    try {
      const existingUsername = await User.findOne({ username: req.body.username })
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already in use' })
      }
      const existingEmail = await User.findOne({ email: req.body.email })
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already in use' })
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      let user = await newUser.save()

      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15 minutes' })
      const mailOptions = {
        from: 'noreply@arcadearchive.com',
        to: user.email,
        subject: "Hello from Arcade Archive!",
        text: `Follow the link to verify your account ${process.env.FRONTEND_URL}/verify?token=${token}`,
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error });
        } else {
          res.status(200).json({ message: info.response })
        }
      })

      res.status(200).json({ message: "User registered successfully", status: "ok" })
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ 
        $or: [{ email: req.body.emailOrUsername }, { username: req.body.emailOrUsername }]
      })
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      if (!user.verified) {
        return res.status(401).json({ error: 'User not verified' })
      }

      const token = jsonwebtoken.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "30 days" })
      res.cookie('accessToken', token, { httpOnly: true, sameSite: 'none', secure: true })
      res.status(200).json({ token })
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get('/logout', async (req, res) => {
    console.log("clearing authentication cookie")
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true })
    res.status(200).json({ message: "Authentication cookie cleared" })
  })
  .get("/getUser", verifyToken, async (req, res) => {
    try {
      if (Math.floor(Date.now()) < req.user.exp) {
        return res.status(401).json({ error: 'Login expired' })
      }
      const user = await User.findOne({ email: req.user.email }, { username: 1, password: 1, email: 1, profileIcon: 1 })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json({ error: 'Internal server error'})
    }
  })
  .get('/verifyEmail', async (req, res) => {
    try {
      const token = req.query.token

      jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.expiredAt) {
            return res.status(401).json({ error: "Token expired", status: "exp" })
          }
        }
        await User.updateOne({ _id: decoded.id }, { $set: {verified: true} })
        res.status(200).json({ message: "Email successfully verified", status: "ok" })
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get('/resendLink', async (req, res) => {
    try {
      const decodedToken = jsonwebtoken.decode(req.query.token)

      const user = await User.findOne({ _id: decodedToken.id })
      const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15 minutes' })
      const mailOptions = {
        from: 'noreply@arcadearchive.com',
        to: user.email,
        subject: "Hello from Arcade Archive!",
        text: `Follow the link to verify your account ${process.env.FRONTEND_URL}/verify?token=${token}`,
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error });
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
          res.status(400).json({ error: error });
        } else {
          res.status(200).json({ message: info.response })
        }
      })

      res.status(200).json({ message: "Password reset link sent", status: "ok" })
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get('/verifyToken', async (req, res) => {
    try {
      const decodedToken = jsonwebtoken.decode(req.query.token)
      const user = await User.findOne({ _id: decodedToken.id })
      if (!user) {
        return res.status(401).json({ error: "User doesn't exist"})
      }
      res.status(200).json(user.email)
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post('/resetPassword', async (req, res) => {
    try {
      const { userEmail, currentPassword, hash } = req.body
      const user = await User.findOne({ email: userEmail }, { games: 0, reviews: 0, __v: 0 })
      console.log(user)

      const passwordMatch = bcrypt.compareSync(currentPassword, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      user.password = hash
      await user.save()

      res.status(200).json({ message: "Password successfully changed" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default authRouter