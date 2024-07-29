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
          game = await Game.findOneAndUpdate({ game_id: req.body.id }, { $addToSet: {played: user._id} }, { returnDocument: "after" })
          break
        case "playing":
          game = await Game.findOneAndUpdate({ game_id: req.body.id }, { $addToSet: {playing: user._id} }, { returnDocument: "after" })
          break
        case "backlog":
          game = await Game.findOneAndUpdate({ game_id: req.body.id }, { $addToSet: {backlog: user._id} }, { returnDocument: "after" })
          break
        case "wishlist":
          game = await Game.findOneAndUpdate({ game_id: req.body.id }, { $addToSet: {wishlist: user._id} }, { returnDocument: "after" })
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
        { game_id: req.body.game_id },
        { $pull: { ratings: { userRef: req.user.id } } }
      )

      const updatedGame = await Game.findOneAndUpdate(
        { game_id: req.body.game_id },
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
          $project: { name: 1, cover_id: 1, game_id: 1, lastUpdated: 1, release_date: 1, genres: 1, platforms: 1, _id: 0 }
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
              { $project: { name: 1, cover_id: 1, game_id: 1, release_date: 1, platforms: 1, avg_rating: 1, _id: 0 } },
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
      const sortBy = req.query.sortBy || 'release_date'
      const sortOrder = parseInt(req.query.sortOrder)
      
      const pipeline = []
      const filters = {}

      if (genre) filters.genres = parseInt(genre)
      if (platform) filters.platforms = parseInt(platform)
      if (year != null) {
        const currentTime = Math.floor(new Date() / 1000)
        if (year == 0) filters.release_date = { $lt: currentTime }
        else if (year == 1) filters.release_date = { $gt: currentTime }
        else {
          const start = Math.floor(new Date(year, 0, 1) / 1000)
          const end = Math.floor(new Date(year, 11, 31, 23, 59, 59, 999) / 1000)
          filters.release_date = { $gte: start, $lt: end }
        }
      }
      filters.release_date = { ...filters.release_date, $ne: "Unknown" }

      if (Object.keys(filters).length > 0) { pipeline.push({ $match: filters }) }
      pipeline.push({ $sort: { [sortBy]: sortOrder }})
      pipeline.push({ 
        $facet: {
          results: [
            { $project: { name: 1, cover_id: 1, game_id: 1, release_date: 1, platforms: 1, avg_rating: 1, popularity: 1, _id: 0 } },

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
      pipeline.push({$match: { game_id: parseInt(req.params.id) }})
      pipeline.push({
        $lookup: {
          from: 'companies',
          let: { companiesArray: '$companies.company'},
          pipeline: [
            {
              $match: { 
                $expr: {
                  $in: ['$company_id', '$$companiesArray']
                }
               }
            },
            { $project: { name: 1, company_id: 1, _id: 0 } }
          ],
          as: 'companies'
        }
      })
      pipeline.push({
        $lookup: {
          from: 'games',
          let: { collection_id: { $arrayElemAt: ['$collections', 0] } },
          pipeline: [
            { 
              $match: {
                $expr: {
                  $in: ['$$collection_id', '$collections']
                }
              }
            },
            { $project: { name: 1, cover_id: 1, game_id: 1, _id: 0 } },
            { $limit: 6 }
          ],
          as: 'collection'
        }
      })
      if (req.user) {
        pipeline.push({
          $lookup: {
            from: 'users',
            let: { game_ref: '$_id' },
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
                      cond: { $eq: ['$$rating.gameRef', "$$game_ref"] }
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
        const game = await Game.findOneAndUpdate({ game_id: req.params.id }, { $inc: { views: 1 } }, { new: true })
        let view_token = jsonwebtoken.sign({ game_id: req.params.id }, 'secret', { expiresIn: "5 seconds" })
        return res.send({ data: results[0], token: view_token }).status(200)
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
        { $match: { company_id: parseInt(req.params.id) } },
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
                    { $project: { game_id: 1, name: 1, cover_id: 1, release_date: 1, _id: 0 } },
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
        { $match: { series_id: parseInt(req.params.id) } },
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
                    { $project: { game_id: 1, name: 1, cover_id: 1, release_date: 1, _id: 0 } },
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