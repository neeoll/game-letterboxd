import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  expiresAfter: {
    type: mongoose.Schema.Types.Date,
    required: true
  }
})

export default mongoose.model('Token', tokenSchema)