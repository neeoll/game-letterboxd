import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

})

const gameSchema = new mongoose.Schema({
  gameId: Number,
  playing: [mongoose.Schema.Types.ObjectId],
  played: [mongoose.Schema.Types.ObjectId],
  backlog: [mongoose.Schema.Types.ObjectId],
  wishlist: [mongoose.Schema.Types.ObjectId],
  ratings: [ratingSchema],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

export default mongoose.model('Game', gameSchema)