import { useEffect, useState } from "react"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import { RxStarFilled } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { game_statuses } from "../dict"
import { GenerateRandomRatings } from "../temp/ratingPlaceholder"

const Profile = () => {
  if (!localStorage.getItem('jwt-token')) navigate('/login')

  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const ratings = GenerateRandomRatings(50)

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
        setUser(userData.user)

        response = await fetch('http://127.0.0.1:5050/game/profileGames', {
          method: 'POST',
          body: JSON.stringify({ games: userData.user.games }),
          headers: {
            'content-type': 'application/json'
          }
        })
        const profileGames = await response.json()
        console.log(profileGames)

        setGames(profileGames)
        setLoading(false)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserInfo()
    return
  }, [])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-4 justify-center items-center px-12">
      <div className="grid grid-cols-6 grid-rows-1 justify-between w-full gap-4 border-b">
        {/* Game Counts */}
        <div className="col-start-1 col-end-2 flex flex-col text-white/75 bg-neutral-800 rounded p-1">
          <div className="">Game Stats:</div>
          {game_statuses.map((status) => (
            <Link className="flex justify-center items-center align-middle group">
              <div className="group-hover:text-white">{status.name}: {user.games.filter(game => game.status == status.value).length}</div>
            </Link>
          ))}
        </div>
        {/* Games */}
        <div className="col-start-2 col-end-6 flex h-fit gap-2 flex-wrap justify-center">
          {games.map(game => (
            <Link key={game.game_id} to={`/game/${game.game_id}`} className="relative h-32 group">
              <img className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg` : ""} />
              <p className="flex absolute inset-0 p-0.5 items-center justify-center text-white text-xs text-center w-full h-full invisible group-hover:visible">{game.name}</p>
            </Link>
          ))}
        </div>
        {/* Ratings */}
        <div className="col-start-6 col-end-7 flex flex-col justify-start">
          <div className="flex flex-col">
            <div className="flex h-48 gap-1 border-b">
              {ratings.map(rating => (
                <div className="flex flex-col w-1/5 justify-end">
                  <div className={`bg-red-500 hover:bg-red-300 rounded-t`} style={{ height: `calc(${rating.percent}% + 10px)`}} />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2">
              <div className="flex text-white/75 text-sm justify-center items-center">1 <RxStarFilled /></div>
              <div className="flex text-white/75 text-sm justify-center items-center">5 <RxStarFilled /></div>
            </div>
          </div>
        </div>
      </div>
      <pre className="text-white">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default Profile