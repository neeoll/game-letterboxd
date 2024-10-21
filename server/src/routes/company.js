import { Router } from "express"
import Company from "../db/models/Company.js"
import { queryToPipeline } from "../utils/queryToPipeline.js"

const companyRouter = Router()
  .get("/:slug", async (req, res) => {
    try {
      const pipeline = queryToPipeline(req.query, {
        companies: req.params.slug
      })

      const results = await Company.aggregate([
        { $match: { slug: req.params.slug } },
        { $project: { _id: 0 } },
        { $lookup: { from: 'games', pipeline: pipeline, as: 'games' } }
      ])
      res.status(200).json(results[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  })
  .get('/search', async (req, res) => {
    try {
      const results = await Company.aggregate([
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

export default companyRouter