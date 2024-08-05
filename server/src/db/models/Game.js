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
    required: true,
  },
  status: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  }
})

const gameSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true
  },
  avgRating: Number,
  views: {
    type: Number,
    default: 0
  },
  popularity: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },
  playing: [mongoose.Schema.Types.ObjectId],
  played: [mongoose.Schema.Types.ObjectId],
  backlog: [mongoose.Schema.Types.ObjectId],
  wishlist: [mongoose.Schema.Types.ObjectId],
  reviews: [reviewSchema]
})

export default mongoose.model('Game', gameSchema)