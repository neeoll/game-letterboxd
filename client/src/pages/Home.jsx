import axios from "axios"
import { useEffect, useState } from "react"
import { GameCard, HomeReview } from "../components"

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

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col w-full justify-center items-center pt-10 text-white">
        <div className="flex flex-col gap-6 text-center bg-neutral-800 px-4 py-10 rounded-md">
          <p className="text-white/75">Home page currently in progress, please use the navigation links.</p>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex basis-1/2 p-2 gap-4 justify-center items-center">
          {homeData.games.map(game => (
            <GameCard key={game.gameId} game={game} size={"h-32"} />
          ))}
        </div>
        <div className="flex flex-wrap px-24">
          {homeData.reviews.map((review, index) => (
            <HomeReview key={index} review={review} />
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default Home