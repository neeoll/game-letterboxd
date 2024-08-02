import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import { IoWarningOutline } from "react-icons/io5"

const Login = () => {
  const navigate = useNavigate()
  if (localStorage.getItem('jwt-token')) navigate('/profile')

  const recaptcha = useRef()
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [failedLogin, setFailedLogin] = useState(false)

  async function veryifyCaptcha() {
    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) {
      alert('Please verify the reCAPTCHA')
      return false
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyCaptcha`, {
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
      
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
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
    <div className="flex flex-col gap-10 w-full justify-center items-center pb-2">
      <form className="group/form" onSubmit={submitLogin}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Email or Username */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Email or Username</p>
            <input 
              onChange={(e) => {
                e.preventDefault()
                setFailedLogin(false)
                setEmailOrUsername(e.target.value)
              }} 
              type="text" 
              className={`w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none`}
              required 
            />
          </div>
          {/* Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Password</p>
            <input 
              onChange={(e) => {
                setFailedLogin(false)
                setPassword(e.target.value)
              }}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
              minLength={6}
              required 
            />
          </div>
          <ReCAPTCHA ref={recaptcha} sitekey="6LebzAUqAAAAAL18BZ-p-ZznOWC0DpObYrSwWq6K"/>
          <div className="relative w-96 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50">
            <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Login</div>
            <button type="submit" className="relative w-full rounded text-indigo-50 bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Login</button>
          </div>
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