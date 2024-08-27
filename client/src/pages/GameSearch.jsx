import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { genres, platforms, sortCriteria } from "../dict"
import { DisplayButtons, FilterSidebar, GameCard, Pagination, Sort } from "../components"

const GameSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [results, setResults] = useState([])

  const year = parseInt(searchParams.get('year') || '0')
  const currentGenre = parseInt(searchParams.get('genre') || '-1')
  const currentPlatform = parseInt(searchParams.get('platform') || '-1')
  const sortBy = searchParams.get('sortBy') || "releaseDate"
  const sortOrder = parseInt(searchParams.get('sortOrder') || '-1')
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    async function gameSearch() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game?genre=${currentGenre}&platform=${currentPlatform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
      .then(res => {
        setCount(res.data.count[0].count)
        setResults(res.data.results)
        setLoading(false)
      })
      .catch(err => console.error(err))
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

  if (loading) {
    return (
      <div className="flex flex-col gap-2 pb-4 animate-[pulse_1s_linear_infinite]">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {Array.apply(null, Array(Math.floor(Math.random() * 3) + 1)).map(index => (
              <div key={index} className="h-6 w-32 bg-neutral-800 rounded" />
            ))}
          </div>
          <div className="flex w-full justify-between">
            <div className="h-6 w-24 bg-neutral-800 rounded" />
            <div className="flex gap-2">
              <div className="w-40 h-6 rounded bg-neutral-800" />
              <div className="w-12 h-6 rounded bg-neutral-800" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2"> 
          <div className="flex flex-wrap gap-6 justify-center">
            {Array.apply(null, Array(35)).map(index => (
              <div key={index} className={`flex flex-col items-center gap-2`}>
                <div className="relative h-36 aspect-[45/64] bg-neutral-800 rounded" />
                {sortBy == "releaseDate" || sortBy == "avgRating" ? 
                  <div className="w-20 h-6 rounded bg-neutral-800" /> : <></>
                }
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <div className="size-8 bg-neutral-800 rounded"/>
            <div className="h-8 w-36 bg-neutral-800 rounded" />
            <div className="size-8 bg-neutral-800 rounded"/>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className="grid grid-flow-row auto-rows-max gap-2 pb-8 text-white">
      {/* Filtering and Other Details */}
      <div className="flex flex-col px-2">
        <DisplayButtons year={year} genre={currentGenre} platform={currentPlatform} remove={removeQueryParameter} />
        <div className="flex w-full justify-between">
          <div className="flex justify-center items-end text-white/50 font-light text-sm">{count.toLocaleString()} Games</div>
          <div className="flex gap-2">
            <Sort criteria={sortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateQueryParameter} />
            <FilterSidebar genres={genres} genre={currentGenre} platforms={platforms} platform={currentPlatform} year={year} update={updateQueryParameter} />
          </div>
        </div>
      </div>
      {/* Games Display */}
      <div className="flex flex-col justify-center gap-2"> 
        <div className="flex flex-wrap gap-4 justify-center">
          {results.map(game =>
            <GameCard key={game.gameId} size={"h-40"} game={game} sortBy={sortBy} />
          )}
        </div>
        <Pagination page={page} count={count} />
      </div>
    </div>
  )
}

export default GameSearch