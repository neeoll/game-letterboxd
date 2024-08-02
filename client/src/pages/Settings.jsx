import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import CropDialog from "../components/CropDialog"
import { RxCheck, RxCross2 } from 'react-icons/rx'

const Settings = () => {
  const navigate = useNavigate()
  if (!localStorage.getItem('jwt-token')) navigate("/login")

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [profileIcon, setProfileIcon] = useState()
  const [email, setEmail] = useState(null)
  const [emailValid, setEmailValid] = useState(true)
  const [username, setUsername] = useState(null)
  const [usernameValid, setUsernameValid] = useState(true)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  useEffect(() => {
    async function getUserData() {
      const token = localStorage.getItem('jwt-token')
      try {
        setLoading(true)
        let response = await fetch('http://127.0.0.1:5050/auth/getUser', {
          headers: {
            'authorization': token
          }
        })
        const userData = await response.json()
        setUser(userData)
        setLoading(false)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserData()
  }, [])

  const submitChanges = async () => {
    try {
      console.log(JSON.stringify({ username, email, password, profileIcon }))
      let response = await fetch('http://127.0.0.1:5050/user/update', {
        method: 'POST',
        headers: {
          'authorization': localStorage.getItem('jwt-token'),
          'content-type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, profileIcon })
      })
    } catch (err) {
      console.error(err)
      return
    }
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col items-center px-96 gap-6">
      <TabGroup vertical defaultIndex={0} className="flex w-full min-h-96">
        <TabList className="flex flex-col rounded bg-neutral-900 text-white">
          <Tab className="p-3 data-[selected]:bg-neutral-800 data-[selected]:rounded-l">Profile</Tab>
        </TabList>
        <TabPanels className="w-full bg-neutral-800">
          <TabPanel className="flex flex-col gap-2 p-4 text-white">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <CropDialog setProfileIcon={setProfileIcon} />
              </div>
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
                    placeholder={user.username}
                    className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none"
                    maxLength={16}
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
                    placeholder={user.email}
                    className="w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none peer"
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
                  />
                </div>
                {/* Confirm Password */}
                <div className="flex flex-col w-full items-start">
                  <p className="text-sm text-indigo-50/50 font-extralight">Confirm Password</p>
                  <input 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    type="password" 
                    className={`w-full p-1 rounded bg-neutral-700 text-indigo-50/75 outline-none`} 
                    minLength={password?.length || 0}
                  />
                </div>
                <div className={`flex flex-col ${(password || confirmPassword) == null ? "invisible h-0" : "visible h-fit"}`}>
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
                <div className={`relative w-96 group ${(username || email || password) != null ? "" : "size-0 invisible"}`}>
                  <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Save Changes</div>
                  <button onClick={submitChanges} className="relative w-full rounded text-white bg-gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Save Changes</button>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <pre className="text-white">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default Settings