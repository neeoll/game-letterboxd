import { useEffect, useState } from "react"
import { RxStarFilled } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import { DropdownSearch, GameCard, Sort, StyledRating } from "../components"
import { genres, platforms, completionStatuses } from "../dict"
import { calculateRatingDistribution } from "../utils"
import axios from 'axios'

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
      axios.get('/user/profileData')
      .then(res => {
        document.title = `${res.data.username}'s Profile | Arcade Archive`
        setUser(res.data)
        setGenreCounts(countOccurrences(res.data.games.map(game => game.genres).flat().map(item => genres.find(genre => genre.id == item))))
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
        <div className="grid grid-cols-6 grid-auto-rows gap-4">
          {/* Stats */}
          <div className="col-span-1 flex flex-col gap-4">
            {/* Game Counts */}
            <div className="relative h-fit">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
              <div className="relative flex flex-col items-center gap-2 h-full bg-neutral-800 rounded text-white/75 py-2 px-10">
                <p>Stats</p>
                <div className="grid grid-rows-2 grid-cols-2 w-full aspect-square gap-4">
                  {gameStatuses.map((status, index) => (
                    <Link key={index} className="flex flex-col justify-center items-center align-middle group">
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
          <div className="col-span-4 flex flex-col gap-4 h-fit flex-wrap justify-center items-center">
            <div className="flex w-full justify-between gap-4">
              <div className="flex gap-4 w-[26rem]">
                <DropdownSearch array={profileGenres} value={filterGenre} setValue={setFilterGenre} placeholder={"All Genres"} />
                <DropdownSearch array={profilePlatforms} value={filterPlatform} setValue={setFilterPlatform} placeholder={"All Platforms"} />
              </div>
              <div className="flex gap-2">
                <Sort criteria={profileSortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateSort} />
              </div>
            </div>
            <div className="w-full h-full">
              <SimpleBar style={{ maxHeight: 350 }}>
                <div className="flex flex-wrap w-full h-full justify-center">
                  {user.games.filter(handleFilter).sort(handleSort).map((game, index) => (
                    <GameCard key={index} size={"basis-[14.25%]"} game={game} />
                  ))}
                </div>
              </SimpleBar>
            </div>
          </div>
          {/* Review Distribution */}
          <div className="col-span-1 flex flex-col">
            <div className="grid grid-cols-5 h-32 gap-1 border-b">
              {calculateRatingDistribution(user.reviews).map(rating => (
                <div key={rating.rating} className="col-span-1 flex flex-col justify-end">
                  <div className={`bg-gradient-to-t from-accentPrimary to-accentSecondary rounded-t hover:brightness-150`} style={{ height: `${rating.percent}%`}} />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2">
              <div className="flex text-white/75 text-sm justify-center items-center">1 <RxStarFilled /></div>
              <div className="flex text-white/75 text-sm justify-center items-center">5 <RxStarFilled /></div>
            </div>
          </div>
          {/* Reviews */}
          <div className="col-span-6 flex flex-wrap">
            {user.reviews.map((review, index) => (
              <div key={index} className="flex flex-col basis-1/2 gap-2 p-4">
                <div className="grid grid-cols-8 gap-2 text-white">
                  <Link to={`/game/${review.gameSlug}`} className="col-span-1">
                    <img className="w-full object-cover aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${review.gameCover}.jpg`} />
                  </Link>
                  <div className="col-span-7 flex flex-col text-white">
                    <div>{review.gameName}</div>
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
      )}
    </div>
  )
}

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

const profileSortCriteria = [
  { name: "Date Added", value: "lastUpdated" },
  { name: "Name", value: "name" },
  { name: "Release Date", value: "releaseDate" }
]

export default Profile