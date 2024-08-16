import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { genres, platforms, sortCriteria } from "../dict"
import { DisplayButtons, FilterSidebar, GameCard, Pagination, Sort } from "../components"

const GameSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [results, setResults] = useState([])

  const year = parseInt(searchParams.get('year') || '0')
  const currentGenre = parseInt(searchParams.get('genre') || '0')
  const currentPlatform = parseInt(searchParams.get('platform') || '0')
  const sortBy = searchParams.get('sortBy') || "releaseDate"
  const sortOrder = parseInt(searchParams.get('sortOrder') || '-1')
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game?genre=${currentGenre}&platform=${currentPlatform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        alert(message)
        return
      }
      const json = await response.json()
      setCount(json.count[0].count)
      setResults(json.results)
      setLoading(false)
    }
    gameSearch()
  }, [currentGenre, currentPlatform, page, sortBy, sortOrder, year])

  const updateQueryParameter = (params) => {
    const updatedParams = new URLSearchParams(location.search)
    params.forEach(item => {
      updatedParams.set(item.params, item.value)
    })
    setSearchParams(updatedParams)
  }

  const removeQueryParameter = (param) => {
    const updatedParams = new URLSearchParams(location.search)
    updatedParams.delete(param)
    setSearchParams(updatedParams)
  }

  return(
    <div className="flex flex-col gap-2 pb-4">
      <div>
        <DisplayButtons year={year} genre={currentGenre} platform={currentPlatform} remove={removeQueryParameter} />
        <div className="flex w-full justify-between">
          <div className="flex justify-center items-end text-indigo-50/50 font-light text-sm">{count.toLocaleString()} Games</div>
          <div className="flex gap-2">
            <Sort criteria={sortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateQueryParameter} />
            <FilterSidebar genres={genres} genre={currentGenre} platforms={platforms} platform={currentPlatform} year={year} update={updateQueryParameter} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2"> 
        <div className="flex flex-wrap gap-6 justify-center">
          {loading == false ? (
            results.map(game =>
              <GameCard key={game.gameId} size={"h-36"} game={game} sortBy={sortBy} />
            )
          ) : (
            Array.apply(null, Array(35)).map((item, index) => (
              <div key={index} className={`flex flex-col items-center gap-2 animate-[pulse_1.5s_linear_infinite]`}>
                <div className="relative h-36 aspect-[45/64] bg-neutral-800 rounded" />
                {sortBy == "releaseDate" || sortBy == "avgRating" ? 
                  <div className="w-20 h-6 rounded bg-neutral-800" /> : <></>
                }
              </div>
            ))
          )}
        </div>
        <Pagination page={page} count={count} update={updateQueryParameter}/>
      </div>
    </div>
  )
}

export default GameSearch