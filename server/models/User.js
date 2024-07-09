import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  gameRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  status: {
    type: String,
    enum: ['played', 'playing', 'backlog', 'wishlist'], // Example statuses, adjust as needed
    required: true
  },
  gameId: {
    type: Number,
    required: true
  }
})

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  games: [gameSchema],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

export default mongoose.model('User', userSchema)