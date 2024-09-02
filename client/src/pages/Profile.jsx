import { useEffect, useState } from "react"
import { RxStarFilled } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import { gameStatuses } from "../dict"
import { DropdownSearch, GameCard, Sort } from "../components"
import { genres, platforms, profileSortCriteria } from "../dict"
import { calculateRatingDistribution } from "../utils"
import axios from 'axios'
import { countOccurrences } from "../utils/countOccurrences"

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [profileGenres, setGenres] = useState([])
  const [genreCounts, setGenreCounts] = useState([])
  const [profilePlatforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [sortOrder, setSortOrder] = useState(-1)
  const [filterPlatform, setFilterPlatform] = useState(-1)
  const [filterGenre, setFilterGenre] = useState(-1)

  useEffect(() => {
    async function getUserInfo() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profileData`, {
        withCredentials: true
      })
      .then(res => {
        setGenreCounts(countOccurrences(res.data.games.map(game => game.genres).flat().map(item => genres.find(genre => genre.id == item))))
        setUser(res.data)
        setPlatforms(Array.from(new Set(res.data.games.map(game => game.platforms).flat())).map(item => platforms.find(platform => platform.id == item)))
        setGenres(Array.from(new Set(res.data.games.map(game => game.genres).flat())).map(item => genres.find(genre => genre.id == item)))
        setLoading(false)
      })
      .catch(err => {
        if (err.response.status == 401) {
          navigate('/')
        }
      })
    }
    getUserInfo()
    return
  }, [])

  const updateSort = (params) => {
    params.forEach(item => {
      if (item.params == "sortBy") { return setSortBy(item.value) }
      else { return setSortOrder(item.value) }
    })
  }

  const handleSort = (a, b) => {
    if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
    if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
    return 0;
  }

  const handleFilter = (game) => {
    let isMatch = true;
    if (filterPlatform !== -1) {
      isMatch = isMatch && game.platforms.includes(filterPlatform);
    }
    if (filterGenre !== -1) {
      isMatch = isMatch && game.genres.includes(filterGenre);
    }
    return isMatch;
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="py-10">
      {user.games.length == 0 ? (
        <div className="flex flex-col w-full justify-center items-center text-white">
          <div className="flex flex-col gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
            <p className="text-white/75">{"You haven't added any games yet, try searching for some to add to your profile!"}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Stats */}
          <div className="flex flex-col gap-4 basis-1/6">
            {/* Game Counts */}
            <div className="relative h-fit">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
              <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-white/75 py-2 px-10">
                <p>User Stats</p>
                <div className="grid grid-rows-2 grid-cols-2 w-full aspect-square gap-4">
                  {gameStatuses.map(status => (
                    <Link key={status.id} className="flex flex-col justify-center items-center align-middle group">
                      <p className="text-sm group-hover:text-white">{status.name}</p>
                      <div className="text-lg font-bold group-hover:text-white">{user.games.filter(game => game.status == status.value).length}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Top Genres */}
            <div className="relative h-fit">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
              <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-white/75 py-2 px-4">
                <p className="text-md">Your Top Genres</p>
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
          {/* Games */}
          <div className="basis-4/6 flex flex-col gap-4 h-fit flex-wrap justify-center items-center">
            <div className="flex w-full justify-between gap-4">
              {/* <div className="flex justify-center items-end text-white/50 font-light text-sm">{(games.length).toLocaleString()} Games</div> */}
              <div className="flex gap-4 w-[26rem]">
                <DropdownSearch array={profileGenres} value={filterGenre} setValue={setFilterGenre} placeholder={"All Genres"} />
                <DropdownSearch array={profilePlatforms} value={filterPlatform} setValue={setFilterPlatform} placeholder={"All Platforms"} />
              </div>
              <div className="flex gap-2">
                <Sort criteria={profileSortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateSort} />
              </div>
            </div>
            <div className="flex flex-wrap w-full justify-center">
              {user.games.filter(handleFilter).sort(handleSort).map(game => (
                <GameCard key={game.gameId} size={"basis-[12.5%]"} game={game} />
              ))}
            </div>
          </div>
          
            {/* Review Distribution */}
            <div className="flex flex-col basis-1/6">
              <div className="flex h-32 gap-1 border-b">
                {calculateRatingDistribution(user.reviews).map(rating => (
                  <div key={rating.rating} className="flex flex-col w-1/5 justify-end">
                    <div className={`bg-gradient-to-t from-accentPrimary to-accentSecondary rounded-t hover:brightness-150`} style={{ height: `calc(${rating.percent}% + ${rating.percent}px)`}} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-2">
                <div className="flex text-white/75 text-sm justify-center items-center">1 <RxStarFilled /></div>
                <div className="flex text-white/75 text-sm justify-center items-center">5 <RxStarFilled /></div>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Profile