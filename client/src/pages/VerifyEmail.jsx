import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const token = new URLSearchParams(location.search).get("token")

  const [verificationSuccessful, setVerificationSuccessful] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const [linkResend, setLinkResend] = useState(false)

  useEffect(() => {
    async function verify() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyEmail?token=${token}`)
      .then(setVerificationSuccessful(true))
      .catch(setLinkExpired(true))
    }
    verify()
  }, [token])

  const resendLink = async () => {
    setLinkResend(true)
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/resendLink?token=${token}`)
  }

  if (linkResend) {
    setTimeout(() => {
      window.opener = null
      window.open("", "_self")
      window.close()
    }, 5000)
  }

  if (verificationSuccessful) {
    setTimeout(() => {
      navigate("/login")
    }, 5000)
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

  return (
    <div className="flex flex-col w-full justify-center items-center pt-10 text-white">
      <div className="flex flex-col items-center gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
        {verificationSuccessful ? (
          <>
            <p className="text-white/75">Verification successful!</p>
            <p className="text-white/50">Redirecting to login page in 5 seconds...</p>
          </>
        ): (
          <>
            <p className="text-white/75">Verification failed, please try again.</p>
            {linkResend ? (
              <p className="text-white/50 text-sm">Link resent, this tab will close automatically in 5 seconds...</p>
            ) : (
              <button onClick={() => resendLink()} className="w-48 rounded p-1 bg-gradient-to-r from-[#ff9900] to-[#ff00ff] font-medium">Resend</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail