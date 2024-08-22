import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import bcrypt from 'bcryptjs'
import { RxCheck, RxCross2 } from 'react-icons/rx'
import axios from 'axios'

const PasswordReset = () => {
  const navigate = useNavigate()
  const token = new URLSearchParams(location.search).get("token")
  
  const [userEmail, setUserEmail] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [confirmCurrentPassword, setConfirmCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [changeSuccessful, setChangeSuccessful] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const [linkResend, setLinkResend] = useState(false)

  useEffect(() => {
    async function checkLinkValidity() {
     axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyToken?token=${token}`)
     .then(res => setUserEmail(res.data))
     .catch(err => console.error(err))
    }
    checkLinkValidity()
  }, [token])

  async function submitPasswordChange(e) {
    e.preventDefault()

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newPassword, salt)

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resetPassword`, { userEmail, currentPassword, hash })
    .then(setChangeSuccessful(true))
    .catch(err => console.error(err))
  }

  const resendLink = async () => {
    setLinkResend(true)
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/resendLink?token=${token}`)
  }

  if (linkExpired) {
    return (
      <div className="flex flex-col w-full justify-center items-center pt-10 text-white">
        <div className="flex flex-col items-center gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
          <p className="text-white/75">The link you received has expired, please try again.</p>
          {linkResend ? (
            <p className="text-white/50 text-sm">Link resent, this tab will close automatically in 5 seconds...</p>
          ) : (
            <button onClick={() => resendLink()} className="w-48 rounded p-1 bg-gradient-to-r from-[#ff9900] to-[#ff00ff] font-medium">Resend</button>
          )}
        </div>
      </div>
    )
  }

  if (changeSuccessful) {
    setTimeout(() => {
      navigate("/login")
    }, 5000)

    return (
      <div className="flex flex-col w-full justify-center items-center pt-10 text-white">
        <div className="flex flex-col gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
          <p className="text-white/75">
            {"Password successfully reset, redirecting to login page in 5 seconds."}
          </p>
        </div>
      </div>
    )
  }

  return(
    <div className="flex flex-col gap-4 w-full justify-center items-center pb-2">
      {/* Register Form */}
      <form className={`group/form`} onSubmit={submitPasswordChange}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Current Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Current Password</p>
            <input 
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
              maxLength={16}
              required 
            />
          </div>
          {/* Current Password Confirmation */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">Confirm Current Password</p>
            <input 
              onChange={(e) =>  setConfirmCurrentPassword(e.target.value)}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none peer"
              required 
            />
          </div>
          <div className={`flex flex-col ${currentPassword == "" || confirmCurrentPassword == "" ? "invisible h-0" : "visible h-fit"}`}>
            {confirmCurrentPassword != currentPassword ? (
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
          {/* Password */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-indigo-50/50 font-extralight">New Password</p>
            <input 
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
              minLength={6}
              required 
            />
          </div>
          <div className={`relative w-96 group ${currentPassword == confirmCurrentPassword ? "" : "pointer-events-none brightness-50"} group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
            <div type="submit" className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Register</div>
            <button type="submit" className="relative w-full rounded text-white bg-gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Change Password</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PasswordReset