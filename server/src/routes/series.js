import { Router } from "express"
import Series from "../db/models/Series.js"
import { queryToPipeline } from "../utils/queryToPipeline.js"

const seriesRouter = Router()
  .get("/:slug", async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query, {
        series: req.params.slug
      })

      const results = await Series.aggregate([
        { $match: { slug: req.params.slug } },
        { $project: { name: 1 } },
        { $lookup: { from: 'games', pipeline: pipeline, as: 'games' } }
      ])
      res.send(results[0]).status(200)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error'})
    }
  })
  .get('/search', async (req, res) => {
    try {
      const results = await Series.aggregate([
        { $match: { name: { $regex: req.query.title, $options: "i" } } }, 
        { 
          $facet: {
            results: [
              { $project: { name: 1, _id: 0 } },
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

export default seriesRouter