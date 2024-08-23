import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from "compression"
import authRouter from "./routes/auth.js"
import gamesRouter from "./routes/games.js"
import userRouter from "./routes/user.js"

const corsConfig = {
  credentials: true,
  origin: process.env.FRONTEND_URL
}

const app = express()

app.use(compression())
app.use(cors(corsConfig))
app.use(cookieParser())
app.use(express.json())
app.use("/game", gamesRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)

export default app