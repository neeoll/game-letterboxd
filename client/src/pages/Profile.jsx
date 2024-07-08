import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)

  if (!localStorage.getItem('jwt-token')) navigate('/login')

  console.log(localStorage.getItem('jwt-token'))

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem('jwt-token')
      if (!token) navigate('/login')
      try {
        const response = await fetch('http://127.0.0.1:5050/auth/getUser', {
          headers: {
            'authorization': token
          }
        })
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserInfo()
    return
  }, [])

  if (!userData) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <pre className="text-white">{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Profile