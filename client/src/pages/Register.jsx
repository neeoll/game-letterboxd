import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from 'react-google-recaptcha'
import bcrypt from 'bcryptjs'
import { RxCheck, RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { verifyCaptcha } from "../utils"

const Register = () => {
  const navigate = useNavigate()

  const recaptcha = useRef()
  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(true)
  const [username, setUsername] = useState("")
  const [usernameValid, setUsernameValid] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [registerSuccessful, setRegisterSuccessful] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/checkAuthentication`, {
      withCredentials: true
    })
    .then(res => {
      if (res.data == true) {
        return navigate('/profile')
      }
    })
    .catch(err => {
      window.location.reload()
    })
  }, [])

  async function submitRegister(e) {
    e.preventDefault()
    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) { return alert('Please verify the reCAPTCHA') }

    const captchaVerified = await verifyCaptcha(captchaValue)
    if (!captchaVerified) { return alert('reCAPTCHA validation failed') }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const data = { username: username, email: email, password: hash }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, data)
    .then(setRegisterSuccessful(true))
    .catch(err => {
      if (err.response.data.error == 'Username already in use') { setUsernameValid(false) }
      if (err.response.data.error == 'Email already in use') { setEmailValid(false) }
    })
  }

  const resendLink = () => {

  }

  if (registerSuccessful) {
    return (
      <div className="flex flex-col w-full justify-center items-center pt-10 text-white">
        <div className="flex flex-col gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
          <p className="text-white/75">
            {"A verification link was sent to the email you provided."}
          </p>
          <div className="flex justify-center gap-1 text-sm">
            <p className="text-white/50">
              {"Didn't receive the link?"}
            </p>
            <button onClick={() => resendLink()} className="brightness-75 bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent font-medium hover:brightness-100" href="#0">Resend</button>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className="flex flex-col gap-4 w-full justify-center items-center pb-2">
      {/* Register Form */}
      <form className={`group/form`} onSubmit={submitRegister}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Username */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Username</p>
            <input 
              onChange={(e) => {
                setUsernameValid(true)
                setUsername(e.target.value)
              }}
              type="text"
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none"
              maxLength={16}
              required 
            />
            <p className={`${usernameValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>{`"${username}" is already in use.`}</p>
          </div>
          {/* Email */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Email</p>
            <input 
              onChange={(e) => {
                setEmailValid(true)
                setEmail(e.target.value)
              }}
              type="email"
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none peer"
              required 
            />
            <p className={`invisible h-0 ${email != "" ? "peer-invalid:visible peer-invalid:h-fit" : ""} text-pink-500 text-sm`}>Please provide a valid email address.</p>
            <p className={`${emailValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>{`"${email}" is already in use.`}</p>
          </div>
          {/* Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none"
              minLength={6}
              required 
            />
          </div>
          {/* Confirm Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Confirm Password</p>
            <input 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              type="password" 
              className={`w-full p-1 rounded bg-neutral-700 text-white/75 outline-none`} 
              minLength={password.length}
              required 
            />
          </div>
          <div className={`flex flex-col ${password == "" || confirmPassword == "" ? "invisible h-0" : "visible h-fit"}`}>
            {confirmPassword != password ? (
              <div className="flex gap-2 text-pink-500 items-center">
                <RxCross2 className="text-lg" />
                <p>Passwords do not match</p>
              </div>
            ) : (
              <div className="flex gap-2 text-green-500 items-center">
                <RxCheck className="text-lg" />
                <p>Passwords match</p>
              </div>
            )}
          </div>
          <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}/>
          <div className={`relative w-96 group ${password == confirmPassword ? "" : "pointer-events-none brightness-50"} group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
            <div type="submit" className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Register</div>
            <button type="submit" className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Register</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register