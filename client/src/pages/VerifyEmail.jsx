import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { authAPI, mailerAPI } from "../api"

const VerifyEmail = () => {
  const navigate = useNavigate()
  const token = new URLSearchParams(location.search).get("token")

  const [verificationSuccessful, setVerificationSuccessful] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const [linkResend, setLinkResend] = useState(false)

  useEffect(() => {
    document.title = "Verify Email | Arcade Archive"
    authAPI.verifyEmail(token)
    .then(response => {
      if (response.status == "exp") return setLinkExpired(true)
      setVerificationSuccessful(true)
    })
    .catch(err => console.error(err))
  }, [token])

  const resendLink = async () => {
    setLinkResend(true)
    mailerAPI.resendVerify(token)
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
            <button onClick={() => resendLink()} className="w-48 rounded p-1 bg-gradient-to-r from-accentPrimary to-accentSecondary font-medium">Resend</button>
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
              <button onClick={() => resendLink()} className="w-48 rounded p-1 bg-gradient-to-r from-accentPrimary to-accentSecondary font-medium">Resend</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail