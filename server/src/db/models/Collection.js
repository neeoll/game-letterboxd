import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema({
  seriesId: { 
    type: Number, 
    required: true 
  },
  games: [Number],
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model('Collection', collectionSchema)