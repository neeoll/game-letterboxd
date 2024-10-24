import { Router } from "express"
import { Game, User } from "../db/models/index.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { queryToPipeline } from "../utils/queryToPipeline.js"
import mongoose from "mongoose"
import Token from "../db/models/Token.js"
import jsonwebtoken from 'jsonwebtoken'

const gamesRouter = Router()
  .get('/search', async (req, res) => {
    try {
      const results = await Game.aggregate([
        { $match: { name: { $regex: req.query.title, $options: "i" } } }, 
        { 
          $facet: {
            results: [
              { $project: { name: 1, coverId: 1, releaseDate: 1, platforms: 1, avgRating: 1, popularity: 1, slug: 1, _id: 0 } },
              { $sort: { popularity: -1 } },
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
  .get('/all', async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query)
      const results = await Game.aggregate(pipeline)
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.send("An error occurred").status(500)
    }
  })
  .get("/:slug", async (req, res) => {
    try {
      const gameExists = await Game.findOne({ slug: req.params.slug })
      if (!gameExists) { return res.status(404).json({ error: "Not Found" }) }

      let user = jsonwebtoken.decode(req.headers['authorization']) || null

      const pipeline = [
        { $match: { slug: req.params.slug } },
        /* Companies Lookup */
        {
          $lookup: {
            from: 'companies',
            localField: 'companies',
            foreignField: 'slug',
            pipeline: [{ $project: { name: 1, slug: 1, _id: 0 } }],
            as: 'companies'
          }
        },
        /* Series Lookup */
        { $addFields: { seriesSlug: { $arrayElemAt: ['$series', -1] } } },
        {
          $lookup: {
            from: 'games',
            localField: 'seriesSlug',
            foreignField: 'series',
            pipeline: [
              { $match: { slug: { $ne: req.params.slug } } },
              { $project: { name: 1, coverId: 1, slug: 1, _id: 0 } },
              { $limit: 6 }
            ],
            as: 'series'
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'userRef',
                  foreignField: '_id',
                  pipeline: [
                    { $project: { _id: 0, username: 1, profileIcon: 1 } }
                  ],
                  as: 'user'
                }
              },
              { $unwind: '$user' },
              { $sort: { timestamp: -1 } }
            ],
            as: 'reviews'
          }
        },
        {
          $addFields: {
            statusCounts: {
              backlog: { $size: '$backlog' },
              playing: { $size: '$playing' },
              played: { $size: '$played' },
              wishlist: { $size: '$wishlist' }
            }
          }
        },
        { $unset: ['backlog', 'played', 'playing', 'wishlist'] }
      ]

      if (user) {
        pipeline.push(
          {
            $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'gameRef',
              pipeline: [
                {
                  $match: { 
                    $expr: {
                      $eq: ['$userRef', new mongoose.Types.ObjectId(user.id) ]
                    }
                  }
                },
                { $project: { rating: 1, _id: 0 } }
              ],
              as: 'userReview'
            }
          },
          { $unwind: { path: '$userReview', preserveNullAndEmptyArrays: true } },
          { $addFields: { userRating: '$userReview.rating' } },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: 'favoriteGames',
              pipeline: [
                { 
                  $match: {
                    $expr: {
                      $eq: ['$_id', new mongoose.Types.ObjectId(user.id) ]
                    }
                  }
                }
              ],
              as: 'user'
            }
          },
          { 
            $addFields: {
              favorite: { $ne: ['$user', []] }
            }
          },  
          { $unset: ['userReview', 'user'] }
        )
      }
      
      const results = await Game.aggregate(pipeline)

      if (user) {
        const token = await Token.findOne({ user: user.id, game: results[0]._id })
        if (!token) {
          const timestamp = new Date()
          timestamp.setHours(timestamp.getHours() + 12)
          await Token.create({ user: user.id, game: results[0]._id, expiresAfter: timestamp.toISOString() })
        }
      }

      res.status(200).json({ data: results[0], user: !!user })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get("/:slug/:status", async (req, res) => {
    try {
      const { slug, status } = req.params
      
      const results = await Game.aggregate([
        { $match: { slug: slug } },
        {
          $lookup: {
            from: 'users',
            let: { userArray: `$${status}`}, 
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$userArray']
                  }
                }
              },
              { $project: { username: 1, profileIcon: 1, _id: 0 } }
            ],
            as: 'users'
          }
        },
        { $project: { name: 1, coverId: 1, users: 1, slug: 1, _id: 0 } }
      ])
      
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post('/addGame', verifyToken, async (req, res) => {
    try {
      const { status, slug } = req.body
      
      const game = await Game.findOneAndUpdate({ slug: slug }, { $addToSet: { [status]: req.user.id } }, { returnDocument: "after" })
      await User.updateOne(
        { email: req.user.email }, 
        { 
          $addToSet: { 
            games: { gameRef: game._id, lastUpdated: Math.floor(new Date() / 1000), status: req.body.status }
          }
        }
      )

      res.status(200).json({ message: 'all good'})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .post('/favorite', verifyToken, async (req, res) => {
    try {
      const { slug } = req.body
      const game = await Game.findOne({ slug: slug })
      let user = await User.findOne({ email: req.user.email, favoriteGames: game._id })
      
      if (user) {
        await User.updateOne({ email: req.user.email }, { $pull: { favoriteGames: game._id } })
        return res.status(200).json({ message: `${game.name} removed from user ${user.username}'s favorites` })
      }

      user = await User.findOneAndUpdate({ email: req.user.email }, { $addToSet: { favoriteGames: game._id } }, { returnDocument: 'after' })
      res.status(200).json({ message: `${game.name} added to user ${user.username}'s favorites` })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })

export default gamesRouter