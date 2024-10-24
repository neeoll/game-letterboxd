import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { mailerAPI } from "../api"

const SendResetLink = () => {
  const navigate = useNavigate()
  const context = useOutletContext()
  
  const [email, setEmail] = useState("")
  const [resetLinkSent, setResetLinkSent] = useState(false)

  useEffect(() => {
    document.title = "Password Reset Form | Arcade Archive"
    if (context.user != null) return navigate('/profile')
  }, [])

  async function submit(e) {
    e.preventDefault()

    mailerAPI.passwordResetLink(email)
    .then(setResetLinkSent(true))
    .catch(err => console.error(err))
  }

  if (resetLinkSent) {
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
            <button onClick={() => mailerAPI.passwordResetLink(email)} className="brightness-75 bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text text-transparent font-medium hover:brightness-100" href="#0">Resend</button>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className="flex flex-col gap-4 w-full justify-center items-center pb-2">
      {/* Register Form */}
      <form className={`group/form`} onSubmit={submit}>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Email */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Email</p>
            <input 
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full h-8 rounded p-2 text-sm text-white bg-transparent border border-white/50 focus:border-white outline-none peer"
              required 
            />
            <p className={`invisible h-0 ${email != "" ? "peer-invalid:visible peer-invalid:h-fit" : ""} text-pink-500 text-sm`}>Please provide a valid email address.</p>
          </div>
          <div className={`relative w-96 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
            <div type="submit" className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Send Link</div>
            <button type="submit" className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Send Link</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SendResetLink