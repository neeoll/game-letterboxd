import app from './app.js'
import mongoose from 'mongoose'
import 'dotenv/config'
import { calculateAvgRating, calculatePopularity } from './utils/changeStreamHelper.js'

const PORT = process.env.PORT

const ratingUpdateStream = () => {
  const gamesCollection = mongoose.connection.collection('games')
  const changeStream = gamesCollection.watch([
    {
      $match: {
        operationType: 'update',
        $or: [
          { 'updateDescription.updatedFields.ratings': { $exists: true } },
          { 'updateDescription.updatedFields': { $regex: '/^ratings\.\d+\.value$/' } },
          { 'updateDescription.updatedFields.views': { $exists: true } }
        ]
      }
    }
  ])

  changeStream.on('change', async (change) => {
    console.log(change)
    if (change.updateDescription.updatedFields.views) {
      const game = await gamesCollection.findOne({ _id: change.documentKey._id })
      const commentCount = game.reviews.length
      const likeCount = game.ratings.filter(rating => rating.value > 3).length
      const popularity = calculatePopularity(commentCount, likeCount, game.views)
      await gamesCollection.findOneAndUpdate({ _id: change.documentKey._id }, { $set: { popularity: popularity } }, { new: true, useFindAndModify: true })
      return
    } else {
      const game = await gamesCollection.findOne({ _id: change.documentKey._id })
      const average = calculateAvgRating(game.ratings)
      await gamesCollection.findOneAndUpdate({ _id: change.documentKey._id }, { $set: { avg_rating: average } }, { new: true, useFindAndModify: true })
      return
    }
  })
}

mongoose.connect(process.env.ATLAS_URI)
.then(() => {
  console.log("connected to mongodb")
  ratingUpdateStream()

  console.log('change streams set up, listening for changes...')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})