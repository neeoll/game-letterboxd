import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import PasswordStrengthBar from 'react-password-strength-bar'
import bcrypt from 'bcryptjs'
import _debounce from 'debounce'

const Register = () => {
  if (localStorage.getItem('jwt-token')) navigate('/profile')

  const recaptcha = useRef()
  const navigate = useNavigate()
  const availabilityDebounce = _debounce((payload) => checkAvailability(payload), 500)

  const [regData, setRegData] = useState({ 
    email: "", 
    emailValid: false, 
    username: "",
    userValid: false,
    password: ""
  })

  const updateRegData = (payload) => {
    setRegData(prevState => ({
      ...prevState,
      ...payload
    }))
  }
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function checkAvailability(payload) {
    if (Object.entries(payload)[0][1] == "") {
      updateRegData(payload)
      return
    }
    const response = await fetch('http://127.0.0.1:5050/auth/checkAvailability', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    updateRegData(data)
  }

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
    if (captchaVerified && regData.userValid && regData.emailValid) {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      const response = await fetch('http://127.0.0.1:5050/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username: regData.username, email: regData.email, password: hash }),
        headers: {
          'content-type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.status == "ok") {
        navigate('/login')
      } else {
        alert(data.error)
      }
    } else {
      alert('reCAPTCHA validation failed')
    }
  }

  return(
    <div className="flex gap-10 w-full justify-center items-center">
      {/* Register Form */}
      <form onSubmit={submitRegister}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          <div className="flex flex-col w-full items-end">
            <input 
              onChange={(e) => availabilityDebounce({ username: e.target.value })}
              type="text" 
              placeholder="Username" 
              className={`
                w-full p-1 rounded bg-neutral-700 text-white/75 outline-none 
                ${regData.username != "" ? regData.userValid == false ? "outline-red-500" : "outline-green-500" : ""}
              `} 
              required 
            />
            <p className="text-sm text-white/50 font-extralight">Maximum of 16 characters</p>
          </div>
          <input 
            onChange={(e) => {
              e.preventDefault()
              if (e.target.validity.valid) availabilityDebounce({ email: e.target.value })
            }} 
            type="email" 
            placeholder="Email Address" 
            className={`
              w-full p-1 rounded bg-neutral-700 text-white/75 outline-none 
              ${regData.email != "" ? regData.emailValid == false ? "outline-red-500" : "outline-green-500" : ""}
            `}
            required 
          />
          <div className="flex flex-col w-full">
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="Password" 
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none" 
              required 
            />
            <PasswordStrengthBar 
              password={password} 
              minLength={6} 
              shortScoreWord="Minimum of 6 characters" 
              scoreWords={["Weak","Weak","Okay","Good","Strong"]}
              barColors={['#444', '#ef4836', '#f6b44d', '#2b90ef', '#25c281']}
              scoreWordStyle={{
                fontSize: '0.875rem',
                lineHeight: '1rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)'
              }}
            />
          </div>
          <input 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            type="password" 
            placeholder="Confirm Password" 
            className={`w-full p-1 rounded bg-neutral-700 text-white/75 outline-none ${password != "" ? confirmPassword == password ? "ring-2 ring-green-500" : "ring-2 ring-red-500" : ""}`} 
            required 
          />
          <ReCAPTCHA ref={recaptcha} sitekey="6LebzAUqAAAAAL18BZ-p-ZznOWC0DpObYrSwWq6K"/>
          <button type="submit" className="w-full rounded text-white bg-red-500 p-1">Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register