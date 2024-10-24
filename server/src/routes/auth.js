import { Router } from "express"
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import axios from "axios"
import 'dotenv/config'
import User from "../db/models/User.js"
import nodemailer from "nodemailer"
import { verifyToken } from '../middleware/verifyToken.js'

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
  .post('/verifyCaptcha', async (req, res) => {
    try {
      const { captchaValue } = req.body
      const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`)
      res.status(200).json({ data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
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
        text: `Follow the link to verify your account\n${process.env.FRONTEND_URL}/verify-email?token=${token}`,
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error })
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

      const token = jsonwebtoken.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '30 days' })
      res.status(200).json({ token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get("/getUser", async (req, res) => {
    try {
      const accessToken = req.headers['authorization']
      if (!accessToken) { return res.status(200).json(null) }

      const tokenData = jsonwebtoken.decode(accessToken)
      const user = await User.findOne({ email: tokenData.email }, { favoriteGames: 0, games: 0, password: 0, reviews: 0, __v: 0, _id: 0 })
      res.status(200).json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error'})
    }
  })
  .get('/verifyEmail', async (req, res) => {
    try {
      const token = req.query.token

      jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.expiredAt) {
            return res.status(200).json({ message: "Token expired", status: "exp" })
          }
        }
        await User.updateOne({ _id: decoded.id }, { $set: { verified: true } })
        res.status(200).json({ message: "Email successfully verified", status: "ok" })
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get('/verifyToken', async (req, res) => {
    try {
      const { token } = req.query

      jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.expiredAt) {
            return res.status(200).json({ message: "Token expired", status: "exp" })
          }
        }

        const user = await User.findOne({ _id: decoded.id })
        return res.status(200).json({ email: user.email, status: "ok" })
      })
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post('/changePassword', verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email })
      if (!user) { return res.status(401).json({ error: 'Invalid credentials' }) }

      const passwordMatch = bcrypt.compareSync(req.body.oldPassword, user.password)
      if (!passwordMatch) { return res.status(401).json({ error: "Invalid credentials"}) }

      user.password = req.body.hash
      await user.save()
      
      res.status(200).json({ message: "all good" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post('/resetPassword', async (req, res) => {
    try {
      const { userEmail, hash } = req.body
      await User.updateOne({ email: userEmail }, { $set: { password: hash } })
      res.status(200).json({ message: "Password successfully changed" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default authRouter