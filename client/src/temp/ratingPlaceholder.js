export const GenerateRandomRatings = (size) => {
  const ratingArray = []
  for (let i = 0; i < size; i++) {
    const randomRating = Math.max(1, Math.floor(Math.random() * 6))
    ratingArray.push({ value: randomRating })
  }

  const ratings = [
    { value: 1, percent: Math.floor((ratingArray.filter(rating => rating.value == 1).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating.value == 1).length },
    { value: 2, percent: Math.floor((ratingArray.filter(rating => rating.value == 2).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating.value == 2).length },
    { value: 3, percent: Math.floor((ratingArray.filter(rating => rating.value == 3).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating.value == 3).length },
    { value: 4, percent: Math.floor((ratingArray.filter(rating => rating.value == 4).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating.value == 4).length },
    { value: 5, percent: Math.floor((ratingArray.filter(rating => rating.value == 5).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating.value == 5).length },
  ]

  return ratings
}