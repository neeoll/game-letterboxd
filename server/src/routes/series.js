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

export default seriesRouter