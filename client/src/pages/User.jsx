import { useEffect, useState } from "react"
import { RxStarFilled } from "react-icons/rx"
import { Link, useParams } from "react-router-dom"
import 'simplebar-react/dist/simplebar.min.css'
import { GameCard, StyledRating } from "../components"
import { genres, platforms, completionStatuses } from "../dict"
import { calculateRatingDistribution, useAsyncError } from "../utils"
import axios from 'axios'

const User = () => {
  const { username } = useParams()
  const throwError = useAsyncError()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [genreCounts, setGenreCounts] = useState([])

  useEffect(() => {
    async function getUser() {
      axios.get(`/user/${username}`)
      .then(res => {
        document.title = `${res.data.username}'s Profile | Arcade Archive`
        console.log(res.data)
        setUser(res.data)
        setGenreCounts(countOccurrences(res.data.stats.map(game => game.genres).flat().map(item => genres.find(genre => genre.id == item))))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        throwError(err)
      })
    }
    getUser()
  }, [username])

  if (loading) {
    return (
      <div></div>
    )
  }
  
  return (
    <div className="py-10">
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-end gap-4">
          <div className="size-20">
            <img src={user.profileIcon} className="rounded-lg" />
          </div>
          <div className="text-white text-xl font-semibold">{user.username}</div>
        </div>
        <div className="grid grid-cols-7 grid-auto-rows gap-4">
          {/* Bio and Stats */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="text-white/75 text-sm font-light">{user.bio != "" ? user.bio : "No bio"}</div>
            {/* Review Distribution */}
            <div className="col-span-1 flex flex-col">
              <div className="grid grid-cols-5 h-32 gap-1">
                {calculateRatingDistribution(user.reviews).map(rating => (
                  <div key={rating.rating} className="col-span-1 flex flex-col justify-end">
                    <div className={`bg-gradient-to-t from-accentPrimary to-accentSecondary rounded hover:brightness-150`} style={{ height: `calc(${rating.percent}% + 1px)`}} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-2">
                <div className="flex text-white/75 text-sm justify-center items-center">1 <RxStarFilled /></div>
                <div className="flex text-white/75 text-sm justify-center items-center">5 <RxStarFilled /></div>
              </div>
            </div>
            {/* Game Counts */}
            <div className="relative h-fit">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
              <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-white/75 py-2 px-4">
                <p>Stats</p>
                <div className="grid grid-rows-2 grid-cols-2 w-full aspect-square gap-2">
                  {gameStatuses.map((status, index) => (
                    <Link key={index} className="flex flex-col justify-center items-center align-middle group">
                      <p className="text-sm group-hover:text-white">{status.name}</p>
                      <div className="text-lg font-bold group-hover:text-white">{user.stats.filter(game => game.status == status.value).length}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Top Genres */}
            <div className="relative h-fit">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
              <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-white/75 py-2 px-4">
                <p className="text-md">Top Genres</p>
                <div className="flex flex-col w-full aspect-square gap-2">
                  {genreCounts.map((genre, index) => (
                    <div key={index} className="flex justify-between items-center align-middle group">
                      <p className="text-xs group-hover:text-white">{genre[0]}</p>
                      <div className="text-lg font-bold group-hover:text-white">{genre[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Games and Reviews */}
          <div className="col-span-6 flex flex-col">
            {/* Games */}
            <div className="flex flex-col">
              {/* Favorites */}
              <div>
                <div className="text-2xl font-light text-white/50">Favorites</div>
                <div className="flex flex-wrap w-full justify-center">
                  {user.favorites.map((game, index) => (
                    <GameCard key={index} size={`basis-[16.66%]`} game={game} />
                  ))}
                </div>
              </div>
              {/* Recently Played */}
              <div>
                <div className="text-2xl font-light text-white/50">Recently Played</div>
                <div className="flex flex-wrap w-full justify-center">
                  {user.recentlyPlayed.map((game, index) => (
                    <GameCard key={index} size={`basis-[16.66%]`} game={game} />
                  ))}
                </div>
              </div>
            </div>
            {/* Reviews */}
            <div className="flex flex-col">
              <div>Recent Reviews</div>
              {user.reviews.map((review, index) => (
                <div key={index} className="flex flex-col basis-1/2 gap-2 p-4">
                  <div className="grid grid-cols-8 gap-2 text-white">
                    <Link to={`/game/${review.gameSlug}`} className="col-span-1">
                      <img className="w-full object-cover aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${review.gameCover}.jpg`} />
                    </Link>
                    <div className="col-span-7 flex flex-col text-white">
                      <div className="text-white">{review.gameName}</div>
                      <div className="flex gap-2 items-center">
                        <StyledRating readOnly value={review.rating} size="small" />
                        <div className="flex gap-1">
                          {completionStatuses.find(status => status.value == review.status).element()}
                          <p className="text-white/50">on</p> 
                          <Link to={{ pathname: "/games", search: `?platform=${review.platform}`}}>{platforms.find(platform => platform.id == review.platform).name}</Link>
                        </div>
                      </div>
                      <div className="text-white/75">{review.body}</div>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User

const countOccurrences = (array) => {
  const countMap = {}

  array.forEach(item => {
    if (countMap[item.name]) { countMap[item.name]++ } 
    else { countMap[item.name] = 1 }
  })

  const sortedArray = Object.entries(countMap).sort((a, b) => b[1] - a[1])
  return sortedArray.slice(0, 5)
}

const gameStatuses = [
  {
    id: 1,
    name: "Played",
    value: "played"
  },
  {
    id: 2,
    name: "Playing",
    value: "playing"
  },
  {
    id: 3,
    name: "Backlog",
    value: "backlog"
  },
  {
    id: 4,
    name: "Wishlist",
    value: "wishlist"
  },
]