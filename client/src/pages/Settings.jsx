import { useEffect, useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import CropDialog from "../components/CropDialog"
import axios from "axios"

const Settings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [blob, setBlob] = useState()
  const [email, setEmail] = useState(null)
  const [emailValid, setEmailValid] = useState(true)
  const [username, setUsername] = useState(null)
  const [usernameValid, setUsernameValid] = useState(true)

  useEffect(() => {
    async function getUserData() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/getUser`, {
        withCredentials: true
      })
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
    }
    getUserData()
  }, [])

  function srcToFile(src, fileName, mimeType){
    return (fetch(src)
      .then(function(res) { return res.arrayBuffer() })
      .then(function(buf) { return new File([buf], fileName, {type:mimeType}) })
    )
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => { resolve(reader.result) }
    reader.onerror = error => reject(error)
  })

  const submitChanges = async () => {
    const file = await srcToFile(blob, `${blob.split("/")[3]}`, 'image/png')
    const uri = await fileToBase64(file)

    const formData = new FormData()
    formData.append('image', uri)
    formData.append('username', username)
    formData.append('email', email)
    
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/update`, formData, {
      withCredentials: true
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.error(err)
    })
  }

  const sendResetLink = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/sendPasswordResetLink`, {
      withCredentials: true
    })
    .then(res =>  console.log(res.data))
    .catch(err => console.error(err))
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col items-center px-52 gap-6">
      <TabGroup vertical defaultIndex={0} className="flex w-full min-h-96">
        <TabList className="flex flex-col rounded bg-neutral-900 text-white">
          <Tab className="p-3 data-[selected]:bg-neutral-800 data-[selected]:rounded-l">Profile</Tab>
          <Tab className="p-3 data-[selected]:bg-neutral-800 data-[selected]:rounded-l">Security</Tab>
        </TabList>
        <TabPanels className="w-full bg-neutral-800 rounded-r-md">
          {/* Profile Tab */}
          <TabPanel className="flex gap-2 p-4 text-white">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <CropDialog profileIcon={user.profileIcon} setBlob={setBlob} />
              </div>
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
                    placeholder={user.username}
                    className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none"
                    maxLength={16}
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
                    placeholder={user.email}
                    className="w-full p-1 rounded bg-neutral-700 text-white/75 outline-none peer"
                  />
                  <p className={`invisible h-0 ${email != "" ? "peer-invalid:visible peer-invalid:h-fit" : ""} text-pink-500 text-sm`}>Please provide a valid email address.</p>
                  <p className={`${emailValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>{`"${email}" is already in use.`}</p>
                </div>
                <div className={`relative w-96 group ${(username || email || blob) != null ? "" : "size-0 invisible"}`}>
                  <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</div>
                  <button onClick={submitChanges} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</button>
                </div>
              </div>
            </div>
          </TabPanel>
          {/* Security and Password Tab */}
          <TabPanel>
            <button onClick={() => sendResetLink()}>Reset Password</button>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default Settings