import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true
  },
  body: {
    type: String
  },
  platform: {
    type: Number,
    required: true
  },
  spoiler: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  gameRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  edited: {
    type: Boolean,
    default: false,
  }
})

export default mongoose.model('Review', reviewSchema)