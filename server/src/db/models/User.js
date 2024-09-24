import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  _id: false,
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
  profileIcon: String,
  bio: {
    type: String,
    default: ""
  },
  verified: {
    type: Boolean,
    default: false
  },
  games: [gameSchema],
  favoriteGames: [mongoose.Schema.Types.ObjectId],
  reviews: [mongoose.Schema.Types.ObjectId]
})

export default mongoose.model('User', userSchema)