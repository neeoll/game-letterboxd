import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import { IoWarningOutline } from "react-icons/io5"

const Login = () => {
  if (localStorage.getItem('jwt-token')) navigate('/profile')

  const recaptcha = useRef()
  const navigate = useNavigate()
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [failedLogin, setFailedLogin] = useState(false)

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
    if (!captchaVerified) return alert('reCAPTCHA validation failed') 
      
    const response = await fetch('http://127.0.0.1:5050/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername: emailOrUsername, password: password }),
      headers: {
        'content-type': 'application/json'
      }
    })
    if (response.status == 401) return setFailedLogin(true)
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('jwt-token', data.token)
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center">
      <form onSubmit={submitLogin}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          <input 
            onChange={(e) => {
              e.preventDefault()
              setFailedLogin(false)
              setEmailOrUsername(e.target.value)
            }} 
            type="text" 
            placeholder="Email Address or Username" 
            className={`w-full p-1 rounded bg-indigo-700 text-indigo-50/75 outline-none`}
            required 
          />
          <input 
            onChange={(e) => {
              setFailedLogin(false)
              setPassword(e.target.value)
            }}
            type="password" 
            placeholder="Password" 
            className="w-full p-1 rounded bg-indigo-700 text-indigo-50/75 outline-none" 
            required 
          />
          <ReCAPTCHA ref={recaptcha} sitekey="6LebzAUqAAAAAL18BZ-p-ZznOWC0DpObYrSwWq6K"/>
          <button type="submit" className="w-full rounded text-indigo-50 bg-red-500 p-1">Login</button>
        </div>
      </form>
      {failedLogin ? (
        <div className="flex justify-center items-center gap-2 p-4 rounded border border-red-500 bg-red-500/25 text-indigo-50">
          <IoWarningOutline size={"1.25em"}/>
          <p>Error: Incorrect username or password, please try again.</p>
        </div>
      ) : <></>}
    </div>
  )
}

export default Login