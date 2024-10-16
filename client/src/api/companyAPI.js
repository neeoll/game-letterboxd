import axios from 'axios'

export const companyAPI = {
  get: async (slug, genre, platform, year, sortBy, sortOrder, page) => {
    const response = await axios.get(`/company/${slug}?genre=${genre}&platform=${platform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
    return response.data
  },
  search: async (text) => {
    const response = await axios.get(`/company/search?name=${text}`)
    return response.data
  }
}