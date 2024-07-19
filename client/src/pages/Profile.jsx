import { useEffect, useState } from "react"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import { RxStarFilled } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { game_statuses } from "../dict"

const calculateRatingDistribution = (ratings) => {
  const ratingArray = []
  ratings.forEach(rating => {
    ratingArray.push(rating.rating)
  })

  const distributions = [
    { value: 1, percent: Math.floor((ratingArray.filter(rating => rating == 1).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 1).length },
    { value: 2, percent: Math.floor((ratingArray.filter(rating => rating == 2).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 2).length },
    { value: 3, percent: Math.floor((ratingArray.filter(rating => rating == 3).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 3).length },
    { value: 4, percent: Math.floor((ratingArray.filter(rating => rating == 4).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 4).length },
    { value: 5, percent: Math.floor((ratingArray.filter(rating => rating == 5).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 5).length },
  ]

  const sum = ratingArray.reduce((acc, current) => acc + current, 0)
  const average = sum / ratingArray.length

  return { distributions: distributions, average: average }
}

const Profile = () => {
  if (!localStorage.getItem('jwt-token')) navigate('/login')

  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState([])

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
        setRatings(calculateRatingDistribution(userData.ratings))

        response = await fetch('http://127.0.0.1:5050/game/profileGames', {
          method: 'POST',
          body: JSON.stringify({ games: userData.games }),
          headers: {
            'content-type': 'application/json'
          }
        })
        const profileGames = await response.json()

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
        <div className="col-start-1 col-end-2 flex flex-col text-indigo-50/75 bg-indigo-800 rounded p-1">
          <div className="">Game Stats:</div>
          {game_statuses.map((status) => (
            <Link className="flex justify-center items-center align-middle group">
              <div className="group-hover:text-indigo-50">{status.name}: {user.games.filter(game => game.status == status.value).length}</div>
            </Link>
          ))}
        </div>
        {/* Games */}
        <div className="col-start-2 col-end-6 flex h-fit gap-2 flex-wrap justify-center">
          {games.map(game => (
            <Link key={game.game_id} to={`/game/${game.game_id}`} className="relative h-32 group">
              <img className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover_id ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover_id}.jpg` : ""} />
              <p className="flex absolute inset-0 p-0.5 items-center justify-center text-indigo-50 text-xs text-center w-full h-full invisible group-hover:visible">{game.name}</p>
            </Link>
          ))}
        </div>
        {/* Ratings */}
        <div className="col-start-6 col-end-7 flex flex-col justify-start">
          <div className="flex flex-col">
            <div className="flex h-32 gap-1 border-b">
              {ratings.distributions.map(rating => (
                <div className="flex flex-col w-1/5 justify-end">
                  <div className={`bg-amber-400 hover:bg-amber-300 rounded-t`} style={{ height: `calc(${rating.percent}% + ${rating.percent}px)`}} />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2">
              <div className="flex text-indigo-50/75 text-sm justify-center items-center">1 <RxStarFilled /></div>
              <div className="flex text-indigo-50/75 text-sm justify-center items-center">5 <RxStarFilled /></div>
            </div>
          </div>
        </div>
      </div>
      <pre className="text-indigo-50">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default Profile