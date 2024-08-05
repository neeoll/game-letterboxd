export const queryToPipeline = (query, match = null) => {
  try {
    const genre = query.genre !== '0' ? query.genre : null
    const platform = query.platform !== '0' ? query.platform : null
    const year = parseInt(query.year)
    const page = parseInt(query.page) - 1
    const sortBy = query.sortBy || 'releaseDate'
    const sortOrder = parseInt(query.sortOrder)

    const pipeline = []
    const filters = {}
    
    if (match) { 
      pipeline.push({
        $match: match
      }) 
    }

    if (genre) filters.genres = parseInt(genre)
    if (platform) filters.platforms = parseInt(platform)
    if (year != null) {
      const currentTime = Math.floor(new Date() / 1000)
      if (year == 0) filters.releaseDate = { $lt: currentTime }
      else if (year == 1) filters.releaseDate = { $gt: currentTime }
      else {
        const start = Math.floor(new Date(year, 0, 1) / 1000)
        const end = Math.floor(new Date(year, 11, 31, 23, 59, 59, 999) / 1000)
        filters.releaseDate = { $gte: start, $lt: end }
      }
    }
    filters.releaseDate = { ...filters.releaseDate, $ne: "Unknown" }

    if (Object.keys(filters).length > 0) { pipeline.push({ $match: filters }) }
    pipeline.push({ $sort: { [sortBy]: sortOrder }})
    pipeline.push({ 
      $facet: {
        results: [
          { $project: { name: 1, coverId: 1, gameId: 1, releaseDate: 1, platforms: 1, avgRating: 1, popularity: 1, _id: 0 } },
          { $skip: page * 35 },
          { $limit: 35 }
        ],
        count: [
          { $count: "count" }
        ]
      }
    })

    return pipeline
  } catch (err) {
    return console.error(err)
  }
}