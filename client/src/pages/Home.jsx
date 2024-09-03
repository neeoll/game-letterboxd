import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import background from "../assets/homepage.png"

const Home = () => {
  const [homeData, setHomeData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getHomeData() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/home`)
      .then(res => {
        setHomeData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
    }
    getHomeData()
  }, [])

  const abbreviateNumber = (num) => {
    const abbreviation = Intl.NumberFormat('en-US', {notation: "compact", maximumFractionDigits: 1}).format(num)
    return abbreviation
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col h-full pt-20">
      {/* Background Image */}
      <div className="absolute -z-20 inset-0 bg-neutral-700">
        <img loading="lazy" className="size-full object-cover brightness-75 skew-y-6 -translate-y-20" src={background} />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 from-20% to-transparent to-60%"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-neutral-900 via-50% to-neutral-900 to-60%"></div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-8">
        {/* Title */}
        <div>
          <div className="font-edunline text-7xl text-transparent bg-gradient-to-t from-accentPrimary to-accentSecondary bg-clip-text">Arcade Archives</div>
          <p className="text-white/75 text-3xl font-light">Discover, Compile, and Review your games</p>
        </div>
        {/* Website Stats */}
        <div className="flex gap-8">
          {homeData.counts.map((count, index) => (
            <div key={index} className="flex flex-col text-white">
              <div className="flex items-center justify-center gap-2 h-4"> 
                {homepageStats.find(stat => stat.id == index).element()}
                <p className="font-light text-white/75 align-middle">{count.name}</p>
              </div>
              <p className="text-lg font-semibold">{abbreviateNumber(count.num)}</p>
            </div>
          ))}
        </div>
        {/* Register or Login */}
        <div className="flex items-center text-white/75 font-light gap-1">
          <div className="relative group">
            <div className="absolute inset-0 blur group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary px-2 py-1">Create Account</div>
            <Link to={'/register'} className="relative rounded font-normal text-white bg-gradient-to-r from-accentPrimary to-accentSecondary px-2 py-1">Create Account</Link>
          </div>
          <p>to get started, or</p>
          <Link to={'/login'} className="text-white">log in</Link>
          <p>if you already have an account</p>
        </div>
        {/* Games */}
        <div className="flex flex-col items-start gap-1">
          <p className="text-white/75 text-2xl font-light">Popular Games</p>
          <div className="flex w-full justify-start items-center">
            {homeData.games.map(game => (
              <Link key={game.gameId} to={`/game/${game.gameId}`} className={`relative basis-[10%] m-1 group rounded hover:outline outline-3 outline-accentPrimary`}>
                <div className="absolute -inset-1 rounded-lg group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm" />
                <img loading="lazy" className="size-full object-cover aspect-[45/64] rounded group-hover:brightness-50" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`} />
                <p className="flex absolute inset-0 p-1 items-center justify-center text-center font-semibold text-white invisible group-hover:visible">{game.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const homepageStats = [
  {
    id: 0,
    element: () => (
      <div className="size-2 rounded-sm bg-green-500" />
    )
  },
  {
    id: 1,
    element: () => (
      <div className="size-2 rounded-sm bg-red-500" />
    )
  },
  {
    id: 2,
    element: () => (
      <div className="size-2 rounded-sm bg-sky-500" />
    )
  }
]

export default Home