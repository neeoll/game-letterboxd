const calculateRatingDistribution = (reviews) => {
  const ratingArray = []
  reviews.forEach(review => {
    ratingArray.push(review.rating)
  })

  return [
    { value: 1, percent: Math.floor((ratingArray.filter(rating => rating == 1).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 1).length },
    { value: 2, percent: Math.floor((ratingArray.filter(rating => rating == 2).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 2).length },
    { value: 3, percent: Math.floor((ratingArray.filter(rating => rating == 3).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 3).length },
    { value: 4, percent: Math.floor((ratingArray.filter(rating => rating == 4).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 4).length },
    { value: 5, percent: Math.floor((ratingArray.filter(rating => rating == 5).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 5).length },
  ]
}

/* const calculateRatingDistribution = (reviews) => {
  return [
    { value: 1, percent: Math.floor((reviews.filter(rating => rating.rating == 1).length / reviews.length) * 100), count: reviews.filter(review => review.rating == 1).length },
    { value: 2, percent: Math.floor((reviews.filter(rating => rating.rating == 2).length / reviews.length) * 100), count: reviews.filter(review => review.rating == 2).length },
    { value: 3, percent: Math.floor((reviews.filter(rating => rating.rating == 3).length / reviews.length) * 100), count: reviews.filter(review => review.rating == 3).length },
    { value: 4, percent: Math.floor((reviews.filter(rating => rating.rating == 4).length / reviews.length) * 100), count: reviews.filter(review => review.rating == 4).length },
    { value: 5, percent: Math.floor((reviews.filter(rating => rating.rating == 5).length / reviews.length) * 100), count: reviews.filter(review => review.rating == 5).length },
  ]
} */