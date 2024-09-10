import mongoose from "mongoose"

const seriesSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true
  },
  games: [Number],
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model('Series', seriesSchema)