import app from './app.js'
import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.connect(process.env.ATLAS_URI)
.then(() => {
  console.log("connected to mongodb")
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})