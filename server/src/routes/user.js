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
        // Find user document
        { $match: { email: req.user.email } },
        // Determine most common genres for user
        { 
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            pipeline: [
              { $unwind: '$genres' },
              { $group: { _id: '$genres', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ],
            as: 'genres'
          }
        },
        // User games lookup
        {
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            let: { games: '$games' },
            pipeline: [
              { $addFields: { doc: { $filter: { input: '$$games', cond: { $eq: ['$$this.gameRef', '$_id'] } } } } },
              { $unwind: '$doc' },
              { $project: { _id: 0, name: 1, slug: 1, coverId: 1, platforms: 1, genres: 1, lastUpdated: '$doc.lastUpdated', status: '$doc.status', } },
            ],
            as: 'games'
          }
        },
        // User reviews lookup
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'userRef',
            pipeline: [
              { $match: { body: { $ne: "" } } },
              { 
                $lookup: {
                  from: 'games',
                  localField: 'gameRef',
                  foreignField: '_id',
                  pipeline: [
                    { $project: { _id: 0, name: 1, slug: 1, coverId: 1 } }
                  ],
                  as: 'game'
                }
              },
              { $unwind: '$game' },
              { $project: { _id: 0, gameRef: 0, userRef: 0, spoiler: 0, edited: 0, __v: 0 } }
            ],
            as: 'reviews'
          }
        },
        // Project necessary values and add game status counts
        { 
          $project: {
            username: 1,
            profileIcon: 1,
            games: 1,
            genres: 1,
            platforms: 1,
            reviews: 1,
            statusCounts: {
              "Played": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['played', '$$game.status'] } } } },
              "Playing": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['playing', '$$game.status'] } } } },
              "Backlog": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['backlog', '$$game.status'] } } } },
              "Wishlist": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['wishlist', '$$game.status'] } } } }
            },
          }
        }
      ])
      
      res.status(200).json(user[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get("/:username", async (req, res) => {
    try {
      const user = await User.aggregate([
        // Find user document
        { $match: { username: req.params.username } },
        // Determine most common genres for user
        { 
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            pipeline: [
              { $unwind: '$genres' },
              { $group: { _id: '$genres', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ],
            as: 'genres'
          }
        },
        // Review data collation
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'userRef',
            pipeline: [
              { $match: { body: { $ne: "" } } },
              {
                $lookup: {
                  from: 'games',
                  localField: 'gameRef',
                  foreignField: '_id',
                  pipeline: [{ $project: { _id: 0, name: 1, slug: 1, coverId: 1 } }],
                  as: 'game'
                }
              },
              { $unwind: '$game' },
              { $project: { _id: 0, __v: 0, gameRef: 0, userRef: 0 } }
            ],
            as: 'reviews'
          }
        },
        // Retrieve most recently played games
        {
          $lookup: {
            from: 'games',
            localField: 'games.gameRef',
            foreignField: '_id',
            let: { games: '$games' },
            pipeline: [
              { $addFields: { doc: { $filter: { input: '$$games', cond: { $eq: ['$$this.gameRef', '$_id'] } } } } },
              { $unwind: '$doc' },
              { $match: { 'doc.status': 'played' } },
              { $sort: { 'doc.lastUpdated': -1 } },
              { $project: { _id: 0, name: 1, slug: 1, coverId: 1 } },
              { $limit: 6 }
            ],
            as: 'recentlyPlayed'
          }
        },
        // Retrive games marked as favorite for user
        {
          $lookup: {
            from: 'games',
            localField: 'favoriteGames',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 0, name: 1, slug: 1, coverId: 1 } }],
            as: 'favorites'
          }
        },
        // Project necessary values and add game status counts
        { 
          $project: {
            _id: 0,
            username: 1, 
            profileIcon: 1, 
            bio: 1, 
            genres: 1,
            reviews: 1,
            recentlyPlayed: 1, 
            recent: 1,
            favorites: 1,
            statusCounts: {
              "Played": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['played', '$$game.status'] } } } },
              "Playing": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['playing', '$$game.status'] } } } },
              "Backlog": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['backlog', '$$game.status'] } } } },
              "Wishlist": { $size: { $filter: { input: '$games', as: 'game', cond: { $eq: ['wishlist', '$$game.status'] } } } }
            },
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