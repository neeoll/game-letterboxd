import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { platforms } from "../dict"
import axios from 'axios'

const SearchResults = () => {
  const location = useLocation()
  const searchText = new URLSearchParams(location.search).get("title")
  
  const [results, setResults] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/search?title=${searchText}`)
      .then(res => {
        setCount(res.data.count[0].count)
        setResults(res.data.results)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
    }
    gameSearch()
    return
  }, [searchText])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col h-fit gap-y-2">
      <div className="flex justify-center text-indigo-50 text-3xl">
        <p>{count} results for <span className="text-4xl font-semibold">{`"${searchText}"`}</span></p>
      </div>
      <div className="flex flex-col gap-2">
        {results.map((game) => (
          <div key={game.gameId} className="flex flex-col pb-[2px] bg-white/75 hover:bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
            <div className="flex items-center gap-2 pb-2 bg-neutral-900">
              <div className="h-36 w-fit rounded">
                <img loading="lazy" className="max-w-full max-h-full object-cover object-center aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`} />
              </div>
              <div className="flex flex-col h-32 justify-start">
                <Link to={`/game/${game.gameId}`} className="flex gap-1 text-indigo-50 text-2xl hover:bg-gradient-to-r from-[#ff9900] to-[#ff00ff] hover:bg-clip-text hover:text-transparent group">
                  <p>{game.name} <span className="text-white/75 group-hover:text-transparent">({new Date(game.releaseDate * 1000).getFullYear()})</span></p>
                </Link>
                <div className="flex text-white gap-1">
                  {game.platforms.map((gamePlatform, index) => (
                    <span key={gamePlatform} className="text-white/75">
                      {platforms.find(platform => platform.id === gamePlatform).name}{index != game.platforms.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults