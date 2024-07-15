import app from './app.js'
import mongoose from 'mongoose'
import 'dotenv/config'

const PORT = process.env.PORT
mongoose.connect(process.env.ATLAS_URI)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})