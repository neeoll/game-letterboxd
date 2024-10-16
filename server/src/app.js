import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from "compression"
import * as Routers from "./routes/index.js"
import * as Models from "./db/models/index.js"

const corsConfig = {
  credentials: true,
  origin: process.env.FRONTEND_URL
}

const app = express()

app.use(cors(corsConfig))
app.use(compression())
app.use(cookieParser())
app.use(express.json())

app.get("/", async (req, res) => {
  try {
    const gamesNum = await Models.Game.countDocuments({})
    const reviewsNum = await Models.Review.countDocuments({})
    const usersNum = await Models.User.countDocuments({})
    
    const games = await Models.Game.aggregate([
      { $project: { slug: 1, coverId: 1, popularity: 1, name: 1 } },
      { $sort: { popularity: -1 } },
      { $limit: 10 },
    ])

    res.status(200).json({ 
      games: games, 
      counts: [
        { name: "Games", num: gamesNum },
        { name: "Reviews", num: reviewsNum },
        { name: "Users", num: usersNum } 
      ]
    })
  } catch (err) {
    console.error(err)
  }
})

app.use("/game", Routers.gamesRouter)
app.use("/auth", Routers.authRouter)
app.use("/user", Routers.userRouter)
app.use("/mailer", Routers.mailerRouter)
app.use("/review", Routers.reviewRouter)
app.use("/company", Routers.companyRouter)
app.use("/series", Routers.seriesRouter)

export default app