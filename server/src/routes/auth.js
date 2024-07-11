import express from "express"
import mongoose from "mongoose"
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import axios from "axios"
import 'dotenv/config'
import User from "../models/User.js"

const router = express.Router()

mongoose.connect(process.env.ATLAS_URI)

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jsonwebtoken.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = decoded
    next()
  })
}

router.post('/verifyCaptcha', async (req, res) => {
  const { captchaValue } = req.body
  const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`)
  res.send(data)
})

router.post("/checkAvailability", async (req, res) => {
  try {
    if (req.body.username) {
      const usernameExists = await User.findOne({ username: req.body.username })
      if (usernameExists) return res.status(401).json({ username: req.body.username, userValid: false })
      else return res.status(200).json({ username: req.body.username, userValid: true })
    }
    if (req.body.email) {
      const emailExists = await User.findOne({ email: req.body.email })
      if (emailExists) return res.status(401).json({ email: req.body.email, emailValid: false })
      else return res.status(200).json({ email: req.body.email, emailValid: true })
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    await newUser.save()
    return res.status(200).json({ message: "User registered successfully", status: "ok" })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ 
      $or: [{ email: req.body.emailOrUsername }, { username: req.body.emailOrUsername }]
    })
    console.log(user)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jsonwebtoken.sign({ email: user.email }, 'secret', { expiresIn: "30 days" })
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get("/getUser", verifyToken, async (req, res) => {
  try {
    if (Math.floor(Date.now()) < req.user.exp) {
      return res.status(401).json({ error: 'Login expired' })
    }
    const user = await User.findOne({ email: req.user.email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error'})
  }
})

export default router