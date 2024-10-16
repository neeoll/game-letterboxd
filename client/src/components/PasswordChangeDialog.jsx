import { useState } from "react"
import { CloseButton, Dialog, DialogPanel } from "@headlessui/react"
import 'simplebar-react/dist/simplebar.min.css'
import { RxCheck, RxCross2 } from "react-icons/rx"
import bcrypt from 'bcryptjs'
import { authAPI } from "../api"

const PasswordChangeDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState(null)
  const [oldPasswordMatch, setOldPasswordMatch] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const submit = async () => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newPassword, salt)

    authAPI.changePassword(oldPassword, hash)
    .then(clear())
    .catch(error => {
      if (error.response.data.error == "Invalid credentials") setOldPasswordMatch(false) 
    })
  }

  const clear = () => {
    setOldPassword(null)
    setNewPassword(null)
    setConfirmPassword(null)
    setDialogOpen(false)
  }

  return (
    <div className="flex justify-center items-center">
      <button onClick={() => setDialogOpen(true)} className="w-full bg-gradient-to-r from-accentPrimary to-accentSecondary rounded text-white rounded p-1 px-2">Change Password</button>
      <Dialog open={dialogOpen} onClose={() => clear()} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-t from-[#ff990055] to-[#ff00ff33]">
          <DialogPanel className="w-1/2">
            <div className="flex flex-col gap-4 items-end rounded-lg bg-neutral-900 p-4 text-white/75">
              <div className="flex w-full justify-between">
                <p>Change Password</p>
                <CloseButton><RxCross2 /></CloseButton>
              </div>
              <div onSubmit={submit} className="flex flex-col w-full justify-center items-center gap-6">
                {/* Old Password */}
                <div className="flex flex-col w-full items-start">
                  <p className="text-sm text-white/50 font-extralight">Old Password</p>
                  <input 
                    onChange={(e) => {
                      setOldPasswordMatch(true)
                      setOldPassword(e.target.value)
                    }}
                    type="password"
                    className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none"
                    maxLength={16}
                    autoComplete="new-password"
                    required
                  />
                  <p className={`${oldPasswordMatch ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>Invalid password.</p>
                </div>
                {/* New Password */}
                <div className="flex flex-col w-full items-start">
                  <p className="text-sm text-white/50 font-extralight">New Password</p>
                  <input 
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none peer"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {/* Confirm Password */}
                <div className="flex flex-col w-full items-start">
                  <p className="text-sm text-white/50 font-extralight">Confirm Password</p>
                  <input 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none peer"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className={`flex flex-col ${newPassword == "" || confirmPassword == "" ? "invisible h-0" : "visible h-fit"}`}>
                  {confirmPassword != newPassword ? (
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
                <div className="flex w-full gap-4 justify-end">
                  <CloseButton className="p-1 text-white/50 hover:text-white">Cancel</CloseButton>
                  <div className={`relative group`}>
                    <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1 px-2">Save Changes</div>
                    <button onClick={() => submit()} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1 px-2">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default PasswordChangeDialog