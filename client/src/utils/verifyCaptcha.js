import axios from 'axios'

export const verifyCaptcha = async (captchaValue) => {
  if (!captchaValue) {
    return alert('Please verify the reCAPTCHA')
  }
  const response = await axios.post(`/auth/verifyCaptcha`, {captchaValue})
  .then(res => { return res.data.data.success ? true : false })
  .catch(err => console.error(err))

  return response
}

export default verifyCaptcha