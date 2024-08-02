import express from "express"
import cors from "cors"
import compression from "compression"
import authRouter from "./routes/auth.js"
import gamesRouter from "./routes/games.js"
import userRouter from "./routes/user.js"

const app = express()

app.use(compression())
app.use(cors())
app.use(express.json())
app.use("/game", gamesRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)

export default app