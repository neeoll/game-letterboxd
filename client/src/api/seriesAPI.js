import axios from 'axios'

export const seriesAPI = {
  get: async (slug, genre, platform, year, sortBy, sortOrder, page) => {
    const response = await axios.get(`/series/${slug}?genre=${genre}&platform=${platform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
    return response.data
  },
  search: async (text) => {
    const response = await axios.get(`/series/search?name=${text}`)
    return response.data
  }
}