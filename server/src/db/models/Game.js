import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

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
  }
})

const gameSchema = new mongoose.Schema({
  gameId: Number,
  avgRating: {
    type: Number,
    default: 0
  },
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
  ratings: [ratingSchema],
  reviews: [reviewSchema]
})

export default mongoose.model('Game', gameSchema)