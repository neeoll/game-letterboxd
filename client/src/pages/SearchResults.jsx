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
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/search?title=${encodeURIComponent(searchText)}`)
      .then(res => {
        setCount(res.data.count[0].count)
        setResults(res.data.results)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
    }
    setTimeout(5000)
    gameSearch()
    return
  }, [searchText])

  if (loading) {
    return (
      <div className="flex flex-col h-fit gap-4 animate-[pulse_1s_linear_infinite]">
        <div className="flex justify-center">
          <div className="h-10 w-96 bg-neutral-800" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.apply(null, Array(10)).map(index => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-36 aspect-[45/64] bg-neutral-800 rounded" />
                <div className="flex flex-col h-32 justify-start gap-2">
                  <div className="h-8 w-72 bg-neutral-800" />
                  <div className="h-6 w-48 bg-neutral-800" />
                </div>
              </div>
              <div className="h-0.5 bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-fit gap-y-2">
      <div className="flex justify-center text-white text-3xl">
        <p>{count} results for <span className="text-4xl font-semibold">{`"${searchText}"`}</span></p>
      </div>
      <div className="flex flex-col gap-2">
        {results.map(game => (
          <div key={game.gameId} className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2">
              <div className="h-36 w-fit rounded">
                <img loading="lazy" className="max-w-full max-h-full object-cover object-center aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`} />
              </div>
              <div className="flex flex-col h-32 justify-start">
                <Link to={`/game/${game.gameId}`} className="flex gap-1 text-white text-2xl hover:bg-gradient-to-r from-accentPrimary to-accentSecondary hover:bg-clip-text hover:text-transparent group/link">
                  <p>{game.name} <span className="text-white/75 group-hover/link:text-transparent">({new Date(game.releaseDate * 1000).getFullYear()})</span></p>
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
            <div className="h-0.5 bg-white/75 group-hover:bg-gradient-to-r from-accentPrimary to-accentSecondary" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults