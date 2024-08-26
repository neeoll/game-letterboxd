import { Router } from "express"
import 'dotenv/config'
import Game from "../db/models/Game.js"
import User from "../db/models/User.js"
import Collection from "../db/models/Collection.js"
import Company from "../db/models/Company.js"
import Review from "../db/models/Review.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { queryToPipeline } from "../utils/queryToPipeline.js"
import mongoose from "mongoose"
import Token from "../db/models/Token.js"
import jsonwebtoken from 'jsonwebtoken'

const gamesRouter = Router()
  .get('/home', async (req, res) => {
    try {
      const games = await Game.aggregate([
        { $project: { gameId: 1, coverId: 1, popularity: 1, name: 1 } },
        { $sort: { popularity: -1 } },
        { $limit: 6 },
      ])
      const reviews = await Review.aggregate([
        { $match: { spoiler: false } },
        { $sort: { timestamp: -1 } },
        { $limit: 6 },
        {
          $lookup: {
            from: 'games',
            localField: 'gameRef',
            foreignField: '_id',
            as: 'game'
          }
        },
        { $unwind: { path: '$game', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userRef',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            rating: { $first: '$rating' },
            body: { $first: '$body' },
            platform: { $first: '$platform' },
            spoiler: { $first: '$spoiler' },
            status: { $first: '$status' },
            timestamp: { $first: '$timestamp' },
            gameRef: { $first: '$gameRef' },
            userRef: { $first: '$userRef' },
            game: { 
              $push: {
                name: '$game.name',
                coverId: '$game.coverId',
                gameId: '$game.gameId'
              } 
            },
            user: { 
              $push: {
                username: '$user.username',
                profileIcon: '$user.profileIcon'
              } 
            }
          }
        }
      ])
      res.status(200).json({games, reviews})
    } catch (err) {
      console.error(err)
    }
  })
  .post('/addGame', verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email })
      let game
      switch (req.body.status) {
        case "played":
          game = await Game.findOneAndUpdate({ gameId: req.body.id }, { $addToSet: {played: user._id} }, { returnDocument: "after" })
          break
        case "playing":
          game = await Game.findOneAndUpdate({ gameId: req.body.id }, { $addToSet: {playing: user._id} }, { returnDocument: "after" })
          break
        case "backlog":
          game = await Game.findOneAndUpdate({ gameId: req.body.id }, { $addToSet: {backlog: user._id} }, { returnDocument: "after" })
          break
        case "wishlist":
          game = await Game.findOneAndUpdate({ gameId: req.body.id }, { $addToSet: {wishlist: user._id} }, { returnDocument: "after" })
          break
        default:
          res.status(500).json({ error: 'Internal server error' })
          break
      }
      
      user.games.push({ gameRef: game._id, lastUpdated: Math.floor(new Date() / 1000), status: req.body.status })
      await user.save()

      res.status(200).json({ message: 'all good'})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .post("/review", verifyToken, async (req, res) => {
    try {
      const { rating, platform, body, spoiler, status, gameId } = req.body
      const { id: userId } = req.user

      const game = await Game.findOne({ gameId: gameId })

      const existingReview = await Review.findOne({ gameRef: game._id, userRef: userId })
      const reviewData = {
        rating: rating,
        body: body,
        platform: platform,
        spoiler: spoiler,
        status: status,
        timestamp: Math.floor(new Date() / 1000),
        gameRef: game._id,
        userRef: userId
      }

      if (existingReview) {
        await Review.updateOne({ _id: existingReview._id }, reviewData);
      } else {
        const newReview = new Review(reviewData)
        const review = await newReview.save()

        await Game.updateOne(
          { gameId: gameId },
          { $addToSet: { reviews: review._id } }
        )
  
        await User.updateOne(
          { _id: userId },
          { 
            $addToSet: { 
              reviews: review._id,
              games: { gameRef: game._id, lastUpdated: Math.floor(new Date / 1000), status: "played" }
            }
          }
        )
      }

      res.status(200).json({ message: "all good" })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get('/search', async (req, res) => {
    try {
      const results = await Game.aggregate([
        { $match: { name: { $regex: req.query.title, $options: "i" } } }, 
        { 
          $facet: {
            results: [
              { $project: { name: 1, coverId: 1, gameId: 1, releaseDate: 1, platforms: 1, avgRating: 1, _id: 0 } },
              { $limit: 100 }
            ],
            count: [ { $count: "count" } ]
          }
        }
      ])
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get('/', async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query)
      const results = await Game.aggregate(pipeline)
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.send("An error occurred").status(500)
    }
  })
  .get("/:id", async (req, res) => {
    try {
      let user = jsonwebtoken.decode(req.cookies.accessToken) || null

      const pipeline = [
        { $match: { gameId: parseInt(req.params.id) } },
        // Lookup Reviews
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'gameRef',
            as: 'reviews'
          }
        },
        // Unwind the reviews array to handle each review separately
        { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
        // Lookup User data for each review
        {
          $lookup: {
            from: 'users',
            localField: 'reviews.userRef',
            foreignField: '_id',
            as: 'reviewUser'
          }
        },
        // Unwind the reviewUser array to get the first matching user
        { $unwind: { path: '$reviewUser', preserveNullAndEmptyArrays: true } },
        // Re-structure the reviews array with user data
        {
          $group: {
            _id: '$_id',
            gameId: { $first: '$gameId' },
            companies: { $first: '$companies' },
            collections: { $first: '$collections' },
            name: { $first: '$name' },
            coverId: { $first: '$coverId' },
            platforms: { $first: '$platforms' },
            releaseDate: { $first: '$releaseDate' },
            genres: { $first: '$genres' },
            summary: { $first: '$summary' },
            avgRating: { $first: '$avgRating' },
            played: { $first: '$played' },
            playing: { $first: '$playing' },
            backlog: { $first: '$backlog' },
            wishlist: { $first: '$wishlist' },
            artworks: { $first: '$artworks' },
            reviews: {
              $push: {
                _id: '$reviews._id',
                rating: '$reviews.rating',
                body: '$reviews.body',
                platform: '$reviews.platform',
                spoiler: '$reviews.spoiler',
                status: '$reviews.status',
                timestamp: '$reviews.timestamp',
                user: {
                  username: '$reviewUser.username',
                  profileIcon: '$reviewUser.profileIcon'
                }
              }
            },
          }
        },
        // Companies Lookup
        {
          $lookup: {
            from: 'companies',
            let: { companiesArray: '$companies' },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$companyId', '$$companiesArray'] }
                }
              },
              { $project: { name: 1, companyId: 1, _id: 0 } }
            ],
            as: 'companies'
          }
        },
        // Series Lookup (collection)
        {
          $lookup: {
            from: 'games',
            let: { collectionId: { $arrayElemAt: ['$collections', 0] } },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$$collectionId', '$collections'] }
                }
              },
              { $project: { name: 1, coverId: 1, gameId: 1, _id: 0 } },
              { $limit: 6 }
            ],
            as: 'collection'
          }
        }
      ]

      if (user) {
        pipeline.push(
          {
            $lookup: {
              from: 'reviews',
              let: { ref: '$_id' },
              pipeline: [
                {
                  $match: { 
                    $expr: {
                      $and: [
                        { $eq: ['$gameRef', '$$ref'] },
                        { $eq: ['$userRef', new mongoose.Types.ObjectId(user.id) ] }
                      ]
                    }
                  }
                },
                { $project: { rating: 1 } }
              ],
              as: 'userReview'
            }
          },
          {
            $unwind: { path: '$userReview', preserveNullAndEmptyArrays: true }
          }
        )
      }
      
      const results = await Game.aggregate(pipeline)
      if (Object.keys(results[0].reviews[0]).length == 1) { results[0].reviews = [] }

      if (user) {
        const token = await Token.findOne({ user: new mongoose.Types.ObjectId(user.id), game: new mongoose.Types.ObjectId(results[0]._id) })
        if (!token) {
          const timestamp = new Date()
          timestamp.setMinutes(timestamp.getMinutes() + 1)
          await Token.create({ user: new mongoose.Types.ObjectId(user.id), game: new mongoose.Types.ObjectId(results[0]._id), expiresAfter: timestamp.toISOString() })
        }
      }

      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get("/company/:id", async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query, {
        companies: { $elemMatch: { 'company': parseInt(req.params.id) } }
      })

      const results = await Company.aggregate([
        { $match: { companyId: parseInt(req.params.id) } },
        { $project: { _id: 0 } },
        { $lookup: { from: 'games', pipeline: pipeline, as: 'games' } }
      ])
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get("/series/:id", async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query, {
        $expr: { $in: [parseInt(req.params.id), '$collections'] }
      })

      const results = await Collection.aggregate([
        { $match: { seriesId: parseInt(req.params.id) } },
        { $project: { name: 1 } },
        { $lookup: { from: 'games', pipeline: pipeline, as: 'games' } }
      ])
      res.send(results[0]).status(200)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error'})
    }
  })

export default gamesRouter