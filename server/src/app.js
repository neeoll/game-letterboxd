import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from "compression"
import authRouter from "./routes/auth.js"
import gamesRouter from "./routes/games.js"
import mailerRouter from "./routes/mailer.js"
import userRouter from "./routes/user.js"

const corsConfig = {
  credentials: true,
  origin: process.env.FRONTEND_URL
}

const app = express()

app.use(cors(corsConfig))
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use("/game", gamesRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/mailer", mailerRouter)

export default app