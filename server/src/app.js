import express from "express"
import cors from "cors"
import compression from "compression"
import games from "./routes/games.js"
import auth from "./routes/auth.js"

const app = express()

app.use(compression())
app.use(cors())
app.use(express.json())
app.use("/game", games)
app.use("/auth", auth)

export default app