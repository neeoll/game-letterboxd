import { Router } from "express"
import 'dotenv/config'
import User from "../db/models/User.js"
import { verifyToken } from "../middleware/verifyToken.js"

const userRouter = Router()
  .post("/update", verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email })
      res.status(200).json({ message: "all good" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get("/profileData", verifyToken, async (req, res) => {
    try {
      const user = await User.aggregate([
        { $match: { email: req.user.email } },
        {
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            pipeline: [
              { $project: { name: 1, coverId: 1, gameId: 1, lastUpdated: 1, releaseDate: 1, genres: 1, platforms: 1, _id: 0 } }
            ],
            as: 'profileGames'
          }
        },
        { $unwind: { path: '$profileGames', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            email: { $first: '$email' },
            password: { $first: '$password' },
            verified: { $first: '$verified' },
            games: { 
              $push: {
                name: '$profileGames.name', 
                coverId: '$profileGames.coverId', 
                gameId: '$profileGames.gameId', 
                lastUpdated: '$games.lastUpdated', 
                status: '$games.status',
                releaseDate: '$profileGames.releaseDate', 
                genres: '$profileGames.genres', 
                platforms: '$profileGames.platforms',
              }
            },
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'userRef',
            pipeline: [
              { $project: { rating: 1 } }
            ],
            as: 'reviews',
          }
        }
      ])
      res.status(200).json(user[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default userRouter