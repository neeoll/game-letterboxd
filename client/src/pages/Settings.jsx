import { useEffect, useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import PasswordChangeDialog from "../components/PasswordChangeDialog"
import ProfileEdit from "../components/Settings/ProfileEdit"

const tabs = ["Profile", "Security", "Tab 3", "Tab 4"]

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
        <TabList className="col-span-2 flex flex-col text-white/50">
          {tabs.map((tab, index) => (
            <Tab key={index} className="flex items-center group">
              <div className="w-[2px] h-full bg-white/50 group-data-[selected]:h-3/4 group-data-[selected]:bg-gradient-to-b from-accentPrimary to-accentSecondary"></div>
              <p className="text-left p-4 text-white/50 group-hover:text-white group-data-[selected]:text-white">{tab}</p>
            </Tab>
          ))}
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