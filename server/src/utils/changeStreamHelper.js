

export const calculateAvgRating = (ratings) => {
  const sum = ratings.reduce((acc, current) => acc + current.value, 0)
  return sum / ratings.length
}

export const calculatePopularity = (commentCount, likeCount, views) => {
  const commentWeight = 1
  const likeWeight = 1
  return ((commentWeight * commentCount) + (likeWeight * likeCount)) * 100 / views
}