import { useState, useRef } from "react"
import { Link, Navigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import { IoWarningOutline } from "react-icons/io5"
import axios from 'axios'
import { verifyCaptcha } from "../utils"

const Login = ({ isAuthenticated }) => {

  const recaptcha = useRef()
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [failedLogin, setFailedLogin] = useState(false)

  async function submitLogin(e) {
    e.preventDefault()
    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) { return alert('Please verify the reCAPTCHA') }

    const captchaVerified = await verifyCaptcha(captchaValue)
    if (!captchaVerified) { return alert('reCAPTCHA validation failed') }

    const data = { emailOrUsername: emailOrUsername, password: password }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data, {
      withCredentials: true
    })
    .then(res => {
      window.location.reload()
    })
    .catch(err => {
      if (err.response.status == 401) setFailedLogin(true) 
    })
  }

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center pb-2">
      <form className="group/form" onSubmit={submitLogin}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Email or Username */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Email or Username</p>
            <input 
              onChange={(e) => {
                e.preventDefault()
                setFailedLogin(false)
                setEmailOrUsername(e.target.value)
              }} 
              type="text" 
              className={`w-full p-1 rounded bg-neutral-700 text-white/75 outline-none`}
              required 
            />
          </div>
          {/* Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Password</p>
            <input 
              onChange={(e) => {
                setFailedLogin(false)
                setPassword(e.target.value)
              }}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none"
              minLength={6}
              required 
            />
          </div>
          <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}/>
          <div className="relative w-96 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50">
            <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Login</div>
            <button type="submit" className="relative w-full rounded text-white bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Login</button>
          </div>
        </div>
      </form>
      <div className="bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent">
        <Link to={'/password-reset-form'}>Forgot your password?</Link>
      </div>
      {failedLogin ? (
        <div className="flex justify-center items-center gap-2 p-4 rounded border border-red-500 bg-red-500/25 text-white">
          <IoWarningOutline size={"1.25em"}/>
          <p>Error: Incorrect username or password, please try again.</p>
        </div>
      ) : <></>}
    </div>
  )
}

export default Login