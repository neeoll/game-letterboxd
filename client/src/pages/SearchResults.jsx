import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { platforms } from "../dict"

const SearchResults = () => {
  const location = useLocation()
  const searchText = new URLSearchParams(location.search).get("title")
  
  const [results, setResults] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/search?title=${searchText}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      console.log(json)
      setCount(json.count[0].count)
      setResults(json.results)
      setLoading(false)
    }
    gameSearch()
    return
  }, [])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col h-fit gap-y-2">
      <div className="flex justify-center text-indigo-50 text-3xl">
        <p>{count} results for <span className="text-4xl font-semibold">"{searchText}"</span></p>
      </div>
      <div className="flex flex-col px-52">
        {results.map(game => (
          <div className="flex items-center gap-2 p-2 border-b border-white/10">
            <div className="max-w-24 max-h-32 flex justify-start items-center">
              <img className="max-w-full max-h-full rounded" src={game.cover_id ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover_id.image_id}.jpg` : ""} />
            </div>
            <div className="flex flex-col h-32 justify-start">
              <Link to={`/game/${game.game_id}`} className="text-indigo-50 text-xl min-w-fit">{game.name} <span className="text-indigo-50/75">({new Date(game.release_date * 1000).getFullYear()})</span></Link>
              <p className="text-indigo-50 text-sm">
                {game.platforms.map((gamePlatform, index) => (
                  <span>
                    {platforms.find(platform => platform.id === gamePlatform).name}{index != game.platforms.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults