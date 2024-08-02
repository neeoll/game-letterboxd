import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  gameRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  lastUpdated: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['played', 'playing', 'backlog', 'wishlist'],
    required: true
  }
})

const ratingSchema = new mongoose.Schema({
  gameRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
})

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  games: [gameSchema],
  ratings: [ratingSchema],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

export default mongoose.model('User', userSchema)