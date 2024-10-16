import axios from "axios"

export const mailerAPI = {
  resendRegister: async (email) => {
    axios.get('/mailer/resendVerification-register', { email })
  },
  resendVerify: async (token) => {
    axios.get(`/mailer/resendVerification-verify?token=${token}`)
  },
  passwordResetLink: async (email) => {
    axios.post('/mailer/sendPasswordResetLink', { email })
  }
}