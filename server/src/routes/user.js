import { Router } from "express"
import 'dotenv/config'
import User from "../db/models/User.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

const upload = multer()

const userRouter = Router()
  .post("/update", [verifyToken, upload.any()], async (req, res) => {
    try {
      const { username, email, image } = req.body

      const existingUsername = await User.findOne({ username: username })
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already in use' })
      }
      const existingEmail = await User.findOne({ email: email })
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already in use' })
      }

      const updatedFields = {}
      if (username != 'null') { updatedFields.username = username }
      if (email != 'null') { updatedFields.email = email }

      if (image != 'null') {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        })
        
        await cloudinary.uploader.upload(image, { public_id: `${req.user.id}-profileIcon` })

        const url = cloudinary.url(`${req.user.id}-profileIcon`)
        updatedFields.profileIcon = url
      }
      
      await User.findOneAndUpdate({ _id: req.user.id }, { $set: updatedFields })

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
        { $unwind: { path: '$games', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            pipeline: [
              { $project: { name: 1, coverId: 1, slug: 1, releaseDate: 1, genres: 1, platforms: 1, _id: 0 } }
            ],
            as: 'profileGames'
          }
        },
        { $unwind: { path: '$profileGames', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            games: { 
              $push: {
                name: '$profileGames.name', 
                coverId: '$profileGames.coverId', 
                slug: '$profileGames.slug', 
                lastUpdated: '$games.lastUpdated', 
                status: '$games.status',
                releaseDate: '$profileGames.releaseDate', 
                genres: '$profileGames.genres', 
                platforms: '$profileGames.platforms',
              }
            }
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'userRef',
            pipeline: [
              { $match: { body: { $ne: "" } } },
              { $project: { _id: 0, userRef: 0 } },
              { $sort: { timestamp: -1 } },
              { $limit: 6 }
            ],
            as: 'reviewData',
          }
        },
        { $unwind: { path: '$reviewData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'games',
            localField: 'reviewData.gameRef',
            foreignField: '_id',
            pipeline: [
              { $project: { name: 1, slug: 1, coverId: 1 } }
            ],
            as: 'reviewedGames'
          }
        },
        { $unwind: { path: '$reviewedGames', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            games: { $first: '$games' },
            reviews: {
              $push: {
                body: '$reviewData.body',
                status: '$reviewData.status',
                rating: '$reviewData.rating',
                timestamp: '$reviewData.timestamp',
                platform: '$reviewData.platform',
                gameName: '$reviewedGames.name',
                gameSlug: '$reviewedGames.slug',
                gameCover: '$reviewedGames.coverId'
              }
            }
          }
        }
      ])
      
      if (Object.keys(user[0].games[0]).length == 0) { user[0].games = [] }
      if (Object.keys(user[0].reviews[0]).length == 0) { user[0].reviews = [] }
      res.status(200).json(user[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default userRouter