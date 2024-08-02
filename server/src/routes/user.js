import { Router } from "express"
import 'dotenv/config'
import jsonwebtoken from 'jsonwebtoken'
import User from "../db/models/User.js"
import { verifyToken } from "../middleware/verifyToken.js"
import mongoose from "mongoose"

const userRouter = Router()
  .post("/update", verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email })
      console.log(user)
      res.status(200).json({ message: "all good" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default userRouter