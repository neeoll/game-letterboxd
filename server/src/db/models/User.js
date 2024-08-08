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

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  verified: {
    type: Boolean,
    default: false
  },
  games: [gameSchema],
  reviews: [mongoose.Schema.Types.ObjectId]
})

export default mongoose.model('User', userSchema)