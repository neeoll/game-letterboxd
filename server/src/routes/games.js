import { json, Router } from "express"
import 'dotenv/config'
import jsonwebtoken from 'jsonwebtoken'
import fetch from "node-fetch"
import Game from "../db/models/Game.js"
import User from "../db/models/User.js"
import Collection from "../db/models/Collection.js"
import Company from "../db/models/Company.js"
import { verifyToken } from "../middleware/verifyToken.js"

const checkViewToken = (req, res, next) => {
  const token = req.headers['view-token']
  
  jsonwebtoken.verify(token, 'secret', (err, decoded) => {
    if (err) {
      if (err.expiredAt) { 
        req.token = null
        return next()
       }
      return next()
    }
    req.token = decoded
    next()
  })
}

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
      user.games.push({ gameRef: game._id, status: req.body.status })
      await user.save()

      res.status(200).json({ message: 'all good'})
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .post('/rateGame', verifyToken, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email })
      const game = await Game.findOneAndUpdate(
        { game_id: req.body.game_id, 'ratings.userRef': user._id }, 
        { $set: { 'ratings.$.value': req.body.rating } },
        { returnDocument: 'after' }
      )
      if (!game) {
        const updatedGame = await Game.findOneAndUpdate(
          { game_id: req.body.game_id },
          { $addToSet: { ratings: { value: req.body.rating, userRef: user._id }}},
          { returnDocument: 'after' }
        )
      }
      await user.save()
      res.status(200).json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .post("/profileGames", async (req, res) => {
    try {
      const ids = []
      req.body.games.forEach(game => ids.push(game.gameRef))

      const results = await Game.find({ _id: { $in: ids }})
      res.status(200).json(results)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  .get('/search', async (req, res) => {
    try {
      console.log(req.query)
      const results = await Game.aggregate([
        { 
          $match: { name: { $regex: req.query.title, $options: "i" } }
        }, 
        { 
          $facet: {
            results: [
              { $project: { name: 1, cover_id: 1, game_id: 1, release_date: 1, platforms: 1, _id: 0 } }
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
            { $project: { name: 1, cover_id: 1, game_id: 1, release_date: 1, platforms: 1, avg_rating: 1, _id: 0 } },

            { $skip: page * 36 },
            { $limit: 36 }
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
  .get("/:id", checkViewToken, async (req, res) => {
    try {
      const results = await Game.aggregate([
        {
          $match: { game_id: parseInt(req.params.id) }
        },
        {
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
              { $project: { name: 1, company_id: 1 } }
            ],
            as: 'companies'
          }
        },
        {
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
              { $project: { name: 1, cover_id: 1, game_id: 1 } },
              { $limit: 6 }
            ],
            as: 'collection'
          }
        }
      ])
      
      if (req.token == null) {
        let view_token = jsonwebtoken.sign({ game_id: req.params.id }, 'secret', { expiresIn: "30 seconds" })
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
                    { $project: { game_id: 1, name: 1, cover_id: 1, release_date: 1 } },
                    { $limit: 36 }
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
      console.log(results)
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
                    { $project: { game_id: 1, name: 1, cover_id: 1, release_date: 1 } },
                    { $limit: 36 }
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