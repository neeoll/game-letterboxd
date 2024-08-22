import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true
  },
  companies: [Number],
  collections: [Number],
  name: String,
  coverId: String,
  platforms: [Number],
  releaseDate: Number,
  genres: [Number],
  summary: String,
  artworks: [String],
  popularity: Number,
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
  reviews: [mongoose.Schema.Types.ObjectId]
})

export default mongoose.model('Game', gameSchema)