import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  game: Number,
  body: String,
  rating: mongoose.Schema.Types.Decimal128
})

export default mongoose.model('Review', reviewSchema)