import { Router } from "express"
import Review from "../db/models/Review.js"
import { verifyToken } from "../middleware/verifyToken.js"

const reviewRouter = Router()
  .get("/", verifyToken, async (req, res) => {
    try {
      const { gameRef } = req.query
      const { id: userId } = req.user
      const review = await Review.findOne({ gameRef: gameRef, userRef: userId })
      if (!review) {
        return res.status(200)
      }
      res.status(200).json(review)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post("/", verifyToken, async (req, res) => {
    try {
      const { rating, platform, body, spoiler, status, gameRef } = req.body
      const { id: userId } = req.user

      const existingReview = await Review.findOne({ gameRef: gameRef, userRef: userId })
      const reviewData = {
        rating: rating,
        body: body,
        platform: platform,
        spoiler: spoiler,
        status: status,
        timestamp: Math.floor(new Date() / 1000),
        gameRef: gameId,
        userRef: userId
      }

      if (existingReview) { await Review.updateOne({ _id: existingReview._id }, reviewData) } 
      else { await Review.create(reviewData) }

      res.status(200).json({ message: "all good" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default reviewRouter