import { useEffect, useState } from "react"
import { RxStarFilled } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { gameStatuses } from "../dict"
import { DropdownSearch, GameCard, Sort } from "../components"
import { genres, platforms, profileSortCriteria } from "../dict"
import { calculateRatingDistribution } from "../utils"
import axios from 'axios'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [profileGenres, setGenres] = useState([])
  const [profilePlatforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [sortOrder, setSortOrder] = useState(-1)
  const [filterPlatform, setFilterPlatform] = useState(0)
  const [filterGenre, setFilterGenre] = useState(0)

  useEffect(() => {
    async function getUserInfo() {
      if (!localStorage.getItem('jwt-token')) { return navigate("/login") }
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profileData`, {
        headers: {
          'authorization': localStorage.getItem('jwt-token')
        }
      })
      .then(res => {
        setUser(res.data)
        setPlatforms(Array.from(new Set(res.data.games.map(game => game.platforms).flat())).map(item => platforms.find(platform => platform.id == item)))
        setGenres(Array.from(new Set(res.data.games.map(game => game.genres).flat())).map(item => genres.find(genre => genre.id == item)))
        setLoading(false)
      })
      .catch(err => console.error(err))
    }
    getUserInfo()
    return
  })

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
            <p className="text-lg">User Stats</p>
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
        {user.games.length == 0 ? (
          <div className="col-start-2 col-end-6 flex flex-col gap-4 h-fit gap-2 flex-wrap justify-center items-center px-10">
            <p className="text-white">
              {"You haven't added any games yet, try searching for some to add to your profile!"}
            </p>
          </div>
        ) : (
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
              {user.games.filter(handleFilter).sort(handleSort).map((game, index) => (
                <GameCard key={index} size={"h-36"} game={game} />
              ))}
            </div>
          </div>
        )}
        {/* Ratings */}
        <div className="col-start-6 col-end-7 flex flex-col justify-start">
          <div className="flex flex-col">
            <div className="flex h-32 gap-1 border-b">
              {calculateRatingDistribution(user.reviews).map((rating, index) => (
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