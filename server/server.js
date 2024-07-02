import express from "express"
import cors from "cors"
import games from "./routes/games.js"
import auth from "./routes/auth.js"
import 'dotenv/config'

const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use("/game", games)
app.use("/auth", auth)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})