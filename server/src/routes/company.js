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

export default companyRouter