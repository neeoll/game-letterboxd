import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])

  if (!localStorage.getItem('jwt-token')) navigate('/login')

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem('jwt-token')
      if (!token) navigate('/login')
      try {
        let response = await fetch('http://127.0.0.1:5050/auth/getUser', {
          headers: {
            'authorization': token
          }
        })
        const userData = await response.json()
        setUser(userData)

        console.log(userData)
        response = await fetch('http://127.0.0.1:5050/game/profileGames', {
          method: 'POST',
          body: JSON.stringify({ games: userData.user.games }),
          headers: {
            'content-type': 'application/json'
          }
        })
        const profileGames = await response.json()
        console.log(profileGames)
        setGames(profileGames.games)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserInfo()
    return
  }, [])

  if (!user) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex w-full h-fit gap-2 flex-wrap justify-start">
          {games.length != 0 ? games.map(game => (
            <Link key={game.id} to={`/game/${game.id}`} className="relative h-36 group text-white font-semibold">
              <img className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg` : ""} />
              <p className="flex absolute inset-0 p-0.5 items-center justify-center text-center w-full h-full invisible group-hover:visible">{game.name}</p>
            </Link>
          )) : <></>}
        </div>
        <pre className="text-white">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Profile