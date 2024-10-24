import { useOutletContext, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { genres, platforms, sortCriteria } from "../dict"
import { DisplayButtons, FilterSidebar, GameCard, Pagination, Sort } from "../components"
import { gameAPI } from "../api/gameAPI"
import { useAsyncError } from "../utils"

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const context = useOutletContext()
  const throwError = useAsyncError()

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
    context.scrollRef.current.scrollTo(0, 0)
    document.title = "Games | Arcade Archive"
    gameAPI.all(currentGenre, currentPlatform, year, sortBy, sortOrder, page)
    .then(response => {
      setCount(response.count[0].count)
      setResults(response.results)
      setLoading(false)
    })
    .catch(error => throwError(error))
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
        <div className="flex flex-col gap-1">
          <div className="flex w-full justify-between">
            <div className="h-6 w-24 placeholder" />
            <div className="flex gap-2">
              <div className="w-40 h-8 placeholder" />
              <div className="w-12 h-8 placeholder" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2"> 
          <div className="flex flex-wrap justify-center">
            {Array.apply(null, Array(35)).map((_, index) => (
              <div key={index} className={`flex flex-col basis-[12.5%] items-center gap-2 p-1`}>
                <div className="relative size-full aspect-[45/64] placeholder" />
                {sortBy == "releaseDate" || sortBy == "avgRating" ? 
                  <div className="w-20 h-8 placeholder" /> : <></>
                }
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <div className="size-8 placeholder"/>
            <div className="h-8 w-36 placeholder" />
            <div className="size-8 placeholder"/>
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
        <div className="flex flex-wrap justify-center">
          {results.map((game, index) =>
            <GameCard key={index} size={"basis-[12.5%]"} game={game} sortBy={sortBy} />
          )}
        </div>
        <Pagination page={page} count={count} update={updateQueryParameter}/>
      </div>
    </div>
  )
}

export default Games