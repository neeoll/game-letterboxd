import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { DisplayButtons, Sort, FilterSidebar, GameCard, Pagination } from "../components"
import { genres, platforms, sortCriteria } from "../dict"

const GamesBySeries = () => {
  const { seriesId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [seriesDetails, setSeriesDetails] = useState({})
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game/series/${seriesId}?genre=${currentGenre}&platform=${currentPlatform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        alert(message)
        return
      }
      const json = await response.json()

      setSeriesDetails({ name: json.name })
      setCount(json.games[0].count[0].count)
      setResults(json.games[0].results)
      setLoading(false)
    }
    gameSearch()
  }, [seriesId])

  const updateQueryParameter = (param, value) => {
    const updatedParams = new URLSearchParams(location.search)
    updatedParams.set(param, value)
    setSearchParams(updatedParams)
  }

  const removeQueryParameter = (param) => {
    const updatedParams = new URLSearchParams(location.search)
    updatedParams.delete(param)
    setSearchParams(updatedParams)
  }

  return(
    <div className="flex flex-col gap-4">
      {loading == false ? (
        <div className="flex flex-col mx-52 pb-[2px] text-indigo-50 bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
          <div className="bg-neutral-900 pb-2">
            <p className="text-sm font-light text-indigo-50/50">Series</p>
            <p className="text-3xl font-semibold">{seriesDetails.name}</p>
          </div>
        </div>
      ): (
        <div className="flex flex-col mx-52 pb-[2px] text-indigo-50 bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
          <div className="flex flex-col bg-neutral-900 pb-2 gap-2">
            <div className="w-20 h-6 bg-neutral-800 rounded" />
            <div className="w-96 h-10 bg-neutral-800 rounded" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 pb-4">
        <div className="px-52">
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
          <div className="flex flex-wrap gap-4 justify-center px-40">
            {loading == false ? (
              results.map(game =>
                <GameCard size={"h-52"} game={game} sortBy={sortBy} />
              )
            ) : (
              Array.apply(null, Array(35)).map((item, index) => (
                <div key={index} className={`flex flex-col items-center gap-2 animate-[pulse_1.5s_linear_infinite]`}>
                  <div className="relative h-52 aspect-[45/64] bg-neutral-800 rounded" />
                  {sortBy == "releaseDate" || sortBy == "avgRating" ? 
                    <div className="w-20 h-6 rounded bg-neutral-800" /> : <></>
                  }
                </div>
              ))
            )}
          </div>
          <Pagination page={page} count={count} />
        </div>
      </div>
    </div>
  )
}

export default GamesBySeries