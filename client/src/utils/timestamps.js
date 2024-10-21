export const timestamps = {
  default: (timestamp) => {
    const date = new Date(timestamp * 1000)
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
  },
  verbose: (timestamp) => {
    const date = new Date(timestamp * 1000)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  },
  year: (timestamp) => {
    return new Date(timestamp * 1000).getFullYear()
  }
}