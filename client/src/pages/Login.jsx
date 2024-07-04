import { useState, useRef, useEffect } from "react"
import ReCAPTCHA from 'react-google-recaptcha'

const Login = () => {
  const recaptcha = useRef()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem('jwt-token')
      if (!token) return
      try {
        const response = await fetch('http://127.0.0.1:5050/auth/getUser', {
          headers: {
            'authorization': token
          }
        })
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserInfo()
    return
  }, [])

  async function veryifyCaptcha() {
    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) {
      alert('Please verify the reCAPTCHA')
      return false
    }
    const response = await fetch('http://127.0.0.1:5050/auth/verifyCaptcha', {
      method: 'POST',
      body: JSON.stringify({ captchaValue }),
      headers: {
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    return data.success ? true : false
  }

  async function submitLogin(e) {
    e.preventDefault()
    const captchaVerified = veryifyCaptcha()
    if (captchaVerified) {
      const response = await fetch('http://127.0.0.1:5050/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          'content-type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.token) {
        localStorage.setItem('jwt-token', data.token)
        window.location.reload()
      }
    } else {
      alert('reCAPTCHA validation failed')
    }
  }

  function logout() {
    localStorage.removeItem('jwt-token')
    window.location.reload()
  }

  return(
    <div className="flex gap-10 w-full justify-center items-center">
      {!userData ? 
        (
          <form onSubmit={submitLogin}>
            <div className="flex flex-col w-96 justify-center items-center gap-2">
              <input 
                onChange={(e) => {
                  e.preventDefault()
                  if (e.target.validity.valid) setEmail(e.target.value)
                }} 
                type="email" 
                placeholder="Email Address" 
                className={`w-full p-1 rounded bg-neutral-700 text-white/75 outline-none ${email != "" ? "invalid:ring-2 invalid:ring-red-500" : ""}`}
                required 
              />
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="Password" 
                className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none" 
                required 
              />
              <ReCAPTCHA ref={recaptcha} sitekey="6LebzAUqAAAAAL18BZ-p-ZznOWC0DpObYrSwWq6K"/>
              <button type="submit" className="w-full rounded text-white bg-red-500 p-1">Login</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <pre className="text-white">{JSON.stringify(userData, null, 2)}</pre>
            <button onClick={logout} className="w-24 bg-red-500 text-white rounded p-1">Logout</button>
          </div>
        )
      }
    </div>
  )
}

export default Login