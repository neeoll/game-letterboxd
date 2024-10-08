import { useEffect, useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import PasswordChangeDialog from "../components/PasswordChangeDialog"
import ProfileEdit from "../components/Settings/ProfileEdit"

const Settings = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
            <p className="text-left text-white/50 group-hover:text-white group-data-[selected]:text-white">Profile</p>
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
            <ProfileEdit user={user} />
          </TabPanel>
          {/* Security Tab */}
          <TabPanel className="flex gap-2 p-4 text-white">
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-light text-white/50">Authentication Settings</p>
              <PasswordChangeDialog />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default Settings