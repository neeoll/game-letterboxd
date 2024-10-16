import axios from "axios"

export const authAPI = {
  user: async () => {
    const response = await axios.get('/auth/getUser')
    return response.data
  },
  check: async () => {
    const response = await axios.get('/auth/checkAuthentication')
    return response.data
  },
  captcha: async (captchaValue) => {
    if (!captchaValue) {
      return alert('Please verify the reCAPTCHA')
    }
    const response = await axios.post(`/auth/verifyCaptcha`, { captchaValue })
    return response.data.data.success ? true : false
  },
  token: async (token) => {
    const response = await axios.get(`/auth/verifyToken?token=${token}`)
    return response.data
  },
  login: async (emailOrUsername, password) => {
    const response = await axios.post('/auth/login', { emailOrUsername, password })
    return response.data
  },
  register: async (username, email, password) => {
    const response = await axios.post('/auth/register', { username, email, password })
    return response.data
  },
  resetPassword: async (email, hash) => {
    const response = await axios.post('/auth/resetPassword', { email, hash })
    return response.data
  },
  changePassword: async (oldPassword, hash) => {
    const response = await axios.post('/auth/changePassword', { oldPassword, hash })
    return response.data
  },
  verifyEmail: async (token) => {
    const response = await axios.get(`/auth/verifyEmail?token=${token}`)
    return response.data
  }
}