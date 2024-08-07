import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})

export default mongoose.model('Token', tokenSchema)