import { useEffect, useState } from "react"
import { RxStarFilled } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { gameStatuses } from "../dict"
import { DropdownSearch, GameCard, Sort } from "../components"
import { genres, platforms, profileSortCriteria } from "../dict"

const calculateRatingDistribution = (ratings) => {
  return [
    { value: 1, percent: Math.floor((ratings.filter(rating => rating.rating == 1).length / ratings.length) * 100), count: ratings.filter(rating => rating.rating == 1).length },
    { value: 2, percent: Math.floor((ratings.filter(rating => rating.rating == 2).length / ratings.length) * 100), count: ratings.filter(rating => rating.rating == 2).length },
    { value: 3, percent: Math.floor((ratings.filter(rating => rating.rating == 3).length / ratings.length) * 100), count: ratings.filter(rating => rating.rating == 3).length },
    { value: 4, percent: Math.floor((ratings.filter(rating => rating.rating == 4).length / ratings.length) * 100), count: ratings.filter(rating => rating.rating == 4).length },
    { value: 5, percent: Math.floor((ratings.filter(rating => rating.rating == 5).length / ratings.length) * 100), count: ratings.filter(rating => rating.rating == 5).length },
  ]
}

const Profile = () => {
  const navigate = useNavigate()
  if (!localStorage.getItem('jwt-token')) navigate('/login')

  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [profileGenres, setGenres] = useState([])
  const [profilePlatforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [sortOrder, setSortOrder] = useState(-1)
  const [filterPlatform, setFilterPlatform] = useState(0)
  const [filterGenre, setFilterGenre] = useState(0)

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem('jwt-token')
      try {
        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getUser`, {
          headers: {
            'authorization': token
          }
        })
        const userData = await response.json()
        setUser(userData)

        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game/profileGames`, {
          method: 'POST',
          body: JSON.stringify({ games: userData.games }),
          headers: {
            'content-type': 'application/json'
          }
        })

        const games = await response.json()
        
        setPlatforms(Array.from(new Set(games.map(game => game.platforms).flat())).map(item => platforms.find(platform => platform.id == item)))
        setGenres(Array.from(new Set(games.map(game => game.genres).flat())).map(item => genres.find(genre => genre.id == item)))
        setGames(games)
        setLoading(false)
      } catch (err) {
        console.error(err)
        return
      }
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
    if (filterPlatform !== 0) {
      isMatch = isMatch && game.platforms.includes(filterPlatform);
    }
    if (filterGenre !== 0) {
      isMatch = isMatch && game.genres.includes(filterGenre);
    }
    return isMatch;
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-4 justify-center items-center px-12 pt-6">
      <div className="grid grid-cols-6 grid-rows-1 justify-between w-full gap-4 pb-4">
        {/* Game Counts */}
        <div className="relative col-start-1 col-end-2 h-fit">
          <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-[#ff9900] to-[#ff00ff] opacity-75 blur-sm`} />
          <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-indigo-50/75 py-2 px-10">
            <p className="text-lg">Game Stats</p>
            <div className="grid grid-rows-2 grid-cols-2 w-full aspect-square gap-2">
              {gameStatuses.map((status, index) => (
                <Link key={index} className="flex flex-col justify-center items-center align-middle group">
                  <p className="group-hover:text-indigo-50">{status.name}</p>
                  <div className="text-xl font-bold group-hover:text-indigo-50">{user.games.filter(game => game.status == status.value).length}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Games */}
        <div className="col-start-2 col-end-6 flex flex-col gap-4 h-fit gap-2 flex-wrap justify-center items-center px-10">
          <div className="flex w-full justify-between gap-4">
            {/* <div className="flex justify-center items-end text-indigo-50/50 font-light text-sm">{(games.length).toLocaleString()} Games</div> */}
            <div className="flex gap-4 w-[26rem]">
              <DropdownSearch array={profileGenres} value={filterGenre} setValue={setFilterGenre} placeholder={"Genre"}/>
              <DropdownSearch array={profilePlatforms} value={filterPlatform} setValue={setFilterPlatform} placeholder={"Platform"}/>
            </div>
            <div className="flex gap-2">
              <Sort criteria={profileSortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateSort} />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {games.filter(handleFilter).sort(handleSort).map((game, index) => (
              <GameCard key={index} size={"h-36"} game={game} />
            ))}
          </div>
        </div>
        {/* Ratings */}
        <div className="col-start-6 col-end-7 flex flex-col justify-start">
          <div className="flex flex-col">
            <div className="flex h-32 gap-1 border-b">
              {calculateRatingDistribution(user.ratings).map((rating, index) => (
                <div key={index} className="flex flex-col w-1/5 justify-end">
                  <div className={`bg-gradient-to-t from-[#ff9900] to-[#ff00ff] rounded-t hover:brightness-150`} style={{ height: `calc(${rating.percent}% + ${rating.percent}px)`}} />
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
    </div>
  )
}

export default Profile