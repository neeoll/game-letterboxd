import axios from 'axios'

export const gameAPI = {
  get: async (slug) => {
    const response = await axios.get(`/game/${slug}`)
    return response.data
  },
  status: async (slug, status) => {
    const response = await axios.get(`/game/${slug}/${status}`)
    return response.data
  },
  search: async (text) => {
    const response = await axios.get(`/game/search?title=${text}`)
    return response.data
  },
  all: async (genre, platform, year, sortBy, sortOrder, page) => {
    const response = await axios.get(`/game/all?genre=${genre}&platform=${platform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
    return response.data
  },
  add: async (status, slug) => {
    axios.post('/game/addGame', { status, slug })
  },
  favorite: async (slug) => {
    axios.post('/game/favorite', { slug })
  }
}