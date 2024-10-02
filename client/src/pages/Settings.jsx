import { useEffect, useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import CropDialog from "../components/CropDialog"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Settings = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [uri, setUri] = useState()
  const [email, setEmail] = useState(null)
  const [emailValid, setEmailValid] = useState(true)
  const [username, setUsername] = useState(null)
  const [usernameValid, setUsernameValid] = useState(true)
  const [bio, setBio] = useState(null)

  useEffect(() => {
    async function getUserData() {
      axios.get('/auth/getUser')
      .then(res => {
        document.title = "Settings | Arcade Archive"
        console.log(res.data)
        setUser(res.data)
        setLoading(false)
      })
      .catch(err => {
        if (err.response.status == 401) {
          navigate('/')
        }
      })
    }
    getUserData()
  }, [])

  const submitChanges = async () => {
    const formData = new FormData()
    formData.append('image', uri)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('bio', bio)
    
    axios.post('/user/update', formData)
    .then(res => {
      console.log(res.data)
      window.location.reload()
    })
    .catch(err => {
      console.error(err)
    })
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/50 font-light text-4xl">Settings</p>
      <TabGroup vertical defaultIndex={0} className="grid grid-cols-10 w-full h-full">
        <TabList className="col-span-2 flex flex-col rounded bg-neutral-900 text-white/50">
          <Tab className="border-l-2 border-white/50 p-3 group data-[selected]:border-accentPrimary data-[selected]:my-2 data-[selected]:py-1">
            <p className="text-left text-white/50 group-hover:text-white group-data-[selected]:text-white">Account</p>
          </Tab>
          <Tab className="border-l-2 border-white/50 p-3 group data-[selected]:border-accentPrimary data-[selected]:my-2 data-[selected]:py-1">
            <p className="text-left text-white/50 group-hover:text-white group-data-[selected]:text-white">Security</p>
          </Tab>
          <Tab className="border-l-2 border-white/50 p-3 group data-[selected]:border-accentPrimary data-[selected]:my-2 data-[selected]:py-1">
            <p className="text-left text-white/50 group-hover:text-white group-data-[selected]:text-white">Tab 3</p>
          </Tab>
          <Tab className="border-l-2 border-white/50 p-3 group data-[selected]:border-accentPrimary data-[selected]:my-2 data-[selected]:py-1">
            <p className="text-left text-white/50 group-hover:text-white group-data-[selected]:text-white">Tab 4</p>
          </Tab>
        </TabList>
        <TabPanels className="col-span-8 w-full -mt-12 rounded-r-md">
          {/* Profile Tab */}
          <TabPanel className="flex gap-2 p-4 text-white">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <CropDialog profileIcon={user.profileIcon} setUri={setUri} />
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
                    className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none"
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
                    className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none peer"
                  />
                  <p className={`invisible h-0 ${email != "" ? "peer-invalid:visible peer-invalid:h-fit" : ""} text-pink-500 text-sm`}>Please provide a valid email address.</p>
                  <p className={`${emailValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>{`"${email}" is already in use.`}</p>
                </div>
                {/* Bio */}
                <div className="flex flex-col w-full items-start">
                  <p className="text-sm text-white/50 font-extralight">Bio</p>
                  <div className="relative w-full h-28">
                    <textarea 
                      onChange={(e) => setBio(e.target.value)}
                      defaultValue={user.bio}
                      maxLength={250}
                      className="size-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 text-sm outline-none resize-none peer"
                    />
                    <p className="absolute bottom-1 right-1 font-light text-white/50 text-xs">{bio?.length || 0}/250</p>
                  </div>
                </div>
                <div className={`relative w-96 group ${(username || email || bio || uri) != null ? "" : "size-0 invisible"}`}>
                  <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</div>
                  <button onClick={submitChanges} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</button>
                </div>
              </div>
            </div>
          </TabPanel>
          {/* Security Tab */}
          <TabPanel className="flex gap-2 p-4 text-white bg-neutral-800">
            <div className="flex gap-4">
              <div className="flex flex-col w-96 justify-center items-center gap-2">
                
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default Settings