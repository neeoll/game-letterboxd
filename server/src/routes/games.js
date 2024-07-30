import { Router } from "express"
import 'dotenv/config'
import jsonwebtoken from 'jsonwebtoken'
import Game from "../db/models/Game.js"
import User from "../db/models/User.js"
import Collection from "../db/models/Collection.js"
import Company from "../db/models/Company.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { checkViewToken } from "../middleware/checkViewToken.js"
import { decodeToken } from "../middleware/decodeToken.js"
import mongoose from "mongoose"

const gamesRouter = Router()
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
  .post('/rateGame', verifyToken, async (req, res) => {
    try {
      await Game.updateOne(
        { gameId: req.body.gameId },
        { $pull: { ratings: { userRef: req.user.id } } }
      )

      const updatedGame = await Game.findOneAndUpdate(
        { gameId: req.body.gameId },
        { $addToSet: { ratings: { value: req.body.rating, userRef: req.user.id } } },
        { returnDocument: 'after' }
      )

      await User.updateOne(
        { _id: req.user.id },
        { $pull: { ratings: { gameRef: updatedGame._id } } }
      )
      
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $addToSet: { ratings: { gameRef: updatedGame._id, rating: req.body.rating } } },
        { returnDocument: 'after' }
      )

      res.status(200).json(updatedUser)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post("/profileGames", async (req, res) => {
    try {
      const ids = req.body.games.map(game => new mongoose.Types.ObjectId(game.gameRef))
      const lastUpdatedMap = req.body.games.reduce((map, game) => {
        map[game.gameRef] = game.lastUpdated;
        return map;
      }, {})

      const results = await Game.aggregate([
        {
          $match: { 
            _id: { $in: ids }
          }
        },
        {
          $addFields: {
            lastUpdated: {
              $reduce: {
                input: Object.entries(lastUpdatedMap).map(([key, value]) => ({
                  k: new mongoose.Types.ObjectId(key),
                  v: value
                })),
                initialValue: null,
                in: {
                  $cond: [
                    { $eq: ['$_id', '$$this.k'] },
                    '$$this.v',
                    '$$value'
                  ]
                }
              }
            }
          }
        },
        {
          $project: { name: 1, coverId: 1, gameId: 1, lastUpdated: 1, releaseDate: 1, genres: 1, platforms: 1, _id: 0 }
        },
        {
          $sort: { lastUpdated: -1 }
        }
      ])
      res.status(200).json(results)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get('/search', async (req, res) => {
    try {
      const results = await Game.aggregate([
        { 
          $match: { name: { $regex: req.query.title, $options: "i" } }
        }, 
        { 
          $facet: {
            results: [
              { $project: { name: 1, coverId: 1, gameId: 1, releaseDate: 1, platforms: 1, avgRating: 1, _id: 0 } },
              { $limit: 100 }
            ],
            count: [
              { $count: "count" }
            ]
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
      const genre = req.query.genre !== '0' ? req.query.genre : null
      const platform = req.query.platform !== '0' ? req.query.platform : null
      const year = parseInt(req.query.year)
      const page = parseInt(req.query.page) - 1
      const sortBy = req.query.sortBy || 'releaseDate'
      const sortOrder = parseInt(req.query.sortOrder)
      
      const pipeline = []
      const filters = {}

      if (genre) filters.genres = parseInt(genre)
      if (platform) filters.platforms = parseInt(platform)
      if (year != null) {
        const currentTime = Math.floor(new Date() / 1000)
        if (year == 0) filters.releaseDate = { $lt: currentTime }
        else if (year == 1) filters.releaseDate = { $gt: currentTime }
        else {
          const start = Math.floor(new Date(year, 0, 1) / 1000)
          const end = Math.floor(new Date(year, 11, 31, 23, 59, 59, 999) / 1000)
          filters.releaseDate = { $gte: start, $lt: end }
        }
      }
      filters.releaseDate = { ...filters.releaseDate, $ne: "Unknown" }

      if (Object.keys(filters).length > 0) { pipeline.push({ $match: filters }) }
      pipeline.push({ $sort: { [sortBy]: sortOrder }})
      pipeline.push({ 
        $facet: {
          results: [
            { $project: { name: 1, coverId: 1, gameId: 1, releaseDate: 1, platforms: 1, avgRating: 1, popularity: 1, _id: 0 } },
            { $skip: page * 35 },
            { $limit: 35 }
          ],
          count: [
            { $count: "count" }
          ]
        }
      })

      const results = await Game.aggregate(pipeline)
      res.send(results[0]).status(200)
    } catch (err) {
      console.error(err)
      res.send("An error occurred").status(500)
    }
  })
  .get("/:id", [decodeToken, checkViewToken], async (req, res) => {
    try {
      const pipeline = []
      pipeline.push({$match: { gameId: parseInt(req.params.id) }})
      pipeline.push({
        $lookup: {
          from: 'companies',
          let: { companiesArray: '$companies.company'},
          pipeline: [
            {
              $match: { 
                $expr: {
                  $in: ['$companyId', '$$companiesArray']
                }
               }
            },
            { $project: { name: 1, companyId: 1, _id: 0 } }
          ],
          as: 'companies'
        }
      })
      pipeline.push({
        $lookup: {
          from: 'games',
          let: { collectionId: { $arrayElemAt: ['$collections', 0] } },
          pipeline: [
            { 
              $match: {
                $expr: {
                  $in: ['$$collectionId', '$collections']
                }
              }
            },
            { $project: { name: 1, coverId: 1, gameId: 1, _id: 0 } },
            { $limit: 6 }
          ],
          as: 'collection'
        }
      })
      if (req.user) {
        pipeline.push({
          $lookup: {
            from: 'users',
            let: { gameRef: '$_id' },
            pipeline: [
              {
                $match: { email: req.user.email }
              },
              {
                $project: {
                  ratings: {
                    $filter: {
                      input: '$ratings',
                      as: 'rating',
                      cond: { $eq: ['$$rating.gameRef', "$$gameRef"] }
                    }
                  }
                }
              },
              {
                $project: {
                  rating: { $arrayElemAt: ['$ratings.rating', 0] }
                }
              }
            ],
            as: 'userRating'
          }
        })
      }
      pipeline.push({
        $addFields: {
          userRating: { $arrayElemAt: ['$userRating.rating', 0] }
        }
      })
      const results = await Game.aggregate(pipeline)
      
      if (req.token == null) {
        console.log('writing new token')
        const game = await Game.findOneAndUpdate({ gameId: req.params.id }, { $inc: { views: 1 } }, { new: true })
        let viewToken = jsonwebtoken.sign({ gameId: req.params.id }, 'secret', { expiresIn: "5 seconds" })
        return res.send({ data: results[0], token: viewToken }).status(200)
      }
      
      res.send({ data: results[0] }).status(200)
    } catch (err) {
      console.error(err)
      res.send("An error occurred").status(500)
    }
  })
  .get("/company/:id", async (req, res) => {
    try {
      const results = await Company.aggregate([
        { $match: { companyId: parseInt(req.params.id) } },
        { $project: { _id: 0 } },
        {
          $lookup: {
            from: 'games',
            pipeline: [
              {
                $match: {
                  companies: {
                    $elemMatch: { 'company': parseInt(req.params.id) }
                  }
                }
              },
              {
                $facet: {
                  games: [
                    { $project: { gameId: 1, name: 1, coverId: 1, releaseDate: 1, _id: 0 } },
                    { $limit: 35 }
                  ],
                  count: [
                    { $count: 'count' }
                  ]
                }
              }
            ],
            as: 'results'
          }
        }
      ])
      res.send(results[0]).status(200)
    } catch (err) {
      console.error(err)
      res.send("An error occurred").status(500)
    }
  })
  .get("/series/:id", async (req, res) => {
    try {
      const results = await Collection.aggregate([
        { $match: { seriesId: parseInt(req.params.id) } },
        { $project: { name: 1 } },
        {
          $lookup: {
            from: 'games',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [parseInt(req.params.id), '$collections']
                  }
                }
              },
              {
                $facet: {
                  games: [
                    { $project: { gameId: 1, name: 1, coverId: 1, releaseDate: 1, _id: 0 } },
                    { $limit: 35 }
                  ],
                  count: [
                    { $count: 'count' }
                  ]
                }
              }
            ], 
            as: 'results'
          }
        }
      ])
      res.send(results[0]).status(200)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error'})
    }
  })

export default gamesRouter