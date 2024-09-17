import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from 'axios'
import defaultImg from '../assets/default_profile.png'

const Status = () => {
  const { slug, status } = useParams()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUsers() {
      axios.get(`/game/${slug}/${status}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
    }
    getUsers()
  }, [slug, status])

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col h-fit gap-y-2">
      <div className="flex flex-col gap-2">
        {data.users.map((user, index) => (
          <div key={index} className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2">
              <img loading="lazy" className="size-10 rounded-lg" src={`${user.profileIcon || defaultImg}`} />
                <Link to={``} className="flex gap-1 text-white hover:bg-gradient-to-r from-accentPrimary to-accentSecondary hover:bg-clip-text hover:text-transparent group/link">
                  <p>{user.username}</p>
                </Link>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Status