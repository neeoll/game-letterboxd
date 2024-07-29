import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import bcrypt from 'bcryptjs'
import _debounce from 'debounce'
import { RxCheck, RxCross2 } from 'react-icons/rx'

const Register = () => {
  const navigate = useNavigate()
  if (localStorage.getItem('jwt-token')) navigate('/profile')

  const recaptcha = useRef()
  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(true)
  const [username, setUsername] = useState("")
  const [usernameValid, setUsernameValid] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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

  async function submitRegister(e) {
    e.preventDefault()
    const captchaVerified = veryifyCaptcha()
    if (captchaVerified) {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      const response = await fetch('http://127.0.0.1:5050/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username: username, email: email, password: hash }),
        headers: {
          'content-type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.status == "ok") {
        navigate('/login')
      } else {
        if (data.error == 'Username already in use') { setUsernameValid(false) }
        if (data.error == 'Email already in use') { setEmailValid(false) }
      }
    } else {
      alert('reCAPTCHA validation failed')
    }
  }

  return(
    <div className="flex flex-col gap-4 w-full justify-center items-center pb-2">
      {/* Register Form */}
      <form className={`group/form`} onSubmit={submitRegister}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Username */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Username</p>
            <input 
              onChange={(e) => {
                setUsernameValid(true)
                setUsername(e.target.value)
              }}
              type="text"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
              maxLength={16}
              required 
            />
            <p className={`${usernameValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>"{username}" is already in use.</p>
          </div>
          {/* Email */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Email</p>
            <input 
              onChange={(e) => {
                setEmailValid(true)
                setEmail(e.target.value)
              }}
              type="email"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none peer"
              required 
            />
            <p className={`invisible h-0 ${email != "" ? "peer-invalid:visible peer-invalid:h-fit" : ""} text-pink-500 text-sm`}>Please provide a valid email address.</p>
            <p className={`${emailValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>"{email}" is already in use.</p>
          </div>
          {/* Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
              minLength={6}
              required 
            />
          </div>
          {/* Confirm Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Confirm Password</p>
            <input 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              type="password" 
              className={`w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none`} 
              minLength={password.length}
              required 
            />
          </div>
          <div className={`flex flex-col ${password == "" || confirmPassword == "" ? "invisible h-0" : "visible h-fit"}`}>
            {confirmPassword != password ? (
              <div className="flex gap-2 text-pink-500 items-center">
                <RxCross2 size={"1.25em"}/>
                <p>Passwords do not match</p>
              </div>
            ) : (
              <div className="flex gap-2 text-green-500 items-center">
                <RxCheck size={"1.25em"}/>
                <p>Passwords match</p>
              </div>
            )}
          </div>
          <ReCAPTCHA ref={recaptcha} sitekey="6LebzAUqAAAAAL18BZ-p-ZznOWC0DpObYrSwWq6K"/>
          <div className={`relative w-96 group ${password == confirmPassword ? "" : "pointer-events-none brightness-50"} group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
            <div type="submit" className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Register</div>
            <button type="submit" className="relative w-full rounded text-white bg-gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Register</button>
          </div>
        </div>
      </form>
      
    </div>
  )
}

export default Register