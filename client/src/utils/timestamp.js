export const gameCardTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are zero-indexed
  const year = date.getFullYear()

  return `${month}-${day}-${year}`
}

export const gameDetailsTimestamp = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000) // Convert seconds to milliseconds
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${month} ${day}, ${year}`
}

export const getYearFromTimestamp = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000) // Convert seconds to milliseconds
  const year = date.getFullYear()

  return year
}