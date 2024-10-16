import axios from 'axios'

export const userAPI = {
  get: async () => {
    const response = await axios.get('/user/profileData')
    return response.data
  },
  findUser: async (username) => {
    const response = await axios.get(`/user/${username}`)
    return response.data
  },
  update: async (uri, username, bio) => {
    const formData = new FormData()
    formData.append('image', uri)
    formData.append('username', username)
    formData.append('bio', bio)

    const response = await axios.post('/user/update', formData)
    return response.data
  }
}