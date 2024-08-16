

export const countOccurrences = (array) => {
  const countMap = {}

  array.forEach(item => {
    if (countMap[item.name]) {
      countMap[item.name]++
    } else {
      countMap[item.name] = 1
    }
  })

  const sortedArray = Object.entries(countMap).sort((a, b) => b[1] - a[1])
  return sortedArray.slice(1, 6)
}