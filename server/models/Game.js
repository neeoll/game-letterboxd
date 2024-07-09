import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  gameId: Number,
  avgRating: mongoose.Schema.Types.Decimal128,
  playing: [mongoose.Schema.Types.ObjectId],
  played: [mongoose.Schema.Types.ObjectId],
  backlog: [mongoose.Schema.Types.ObjectId],
  wishlist: [mongoose.Schema.Types.ObjectId],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

export default mongoose.model('Game', gameSchema)