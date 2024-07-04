import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import PasswordStrengthBar from 'react-password-strength-bar'
import bcrypt from 'bcryptjs'

const Register = () => {
  const recaptcha = useRef()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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
        alert(data.error)
      }
    } else {
      alert('reCAPTCHA validation failed')
    }
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
        alert("Successfully logged in")
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
              onChange={(e) => setUsername(e.target.value)}
              type="text" 
              placeholder="Username" 
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none" 
              required 
            />
            <p className="text-sm text-white/50 font-extralight">Maximum of 16 characters</p>
          </div>
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