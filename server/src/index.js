import app from './app.js'
import mongoose from 'mongoose'
import 'dotenv/config'

const PORT = process.env.PORT

const proceed = false

const setUpChangeStream = () => {
  const db = mongoose.connection
  const gamesCollection = db.collection('games')
  const changeStream = gamesCollection.watch()

  changeStream.on('change', async (change) => {
    console.log(change)
    if (change.operationType == 'update') {
      const game = await gamesCollection.findOne({ _id: change.documentKey._id })
      const ratings = game.ratings
      const sum = ratings.reduce((acc, current) => acc + current.value, 0)
      const average = sum / ratings.length
      await gamesCollection.findOneAndUpdate({ _id: change.documentKey._id }, { $set: { avg_rating: average } }, { new: true, useFindAndModify: true } )
        .then(() => console.log("document successfully updated"))
    }
  })

  console.log('change stream set up')
}

mongoose.connect(process.env.ATLAS_URI)
.then(() => {
  console.log("connected to mongodb")
  setUpChangeStream()
})




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})