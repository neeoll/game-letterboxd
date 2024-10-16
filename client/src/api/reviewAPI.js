import axios from "axios"

export const reviewAPI = {
  get: async (gameRef) => {
    const response = await axios.get(`/review?gameRef=${gameRef}`)
    return response.data
  },
  create: async (rating, platform, body, spoiler, status, gameRef) => {
    const response = await axios.post('/review', { rating, platform, body, spoiler, status, gameRef })
    return response.data
  },
}