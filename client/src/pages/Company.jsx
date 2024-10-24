import { useEffect, useState } from "react"
import { useOutletContext, useParams, useSearchParams } from "react-router-dom"
import { DisplayButtons, Sort, FilterSidebar, GameCard, Pagination } from "../components"
import { genres, platforms, sortCriteria } from "../dict"
import { companyAPI } from "../api/companyAPI"
import { useAsyncError } from "../utils"

const Company = () => {
  const { slug } = useParams()
  const context = useOutletContext()
  const throwError = useAsyncError()

  const [searchParams, setSearchParams] = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [companyDetails, setCompanyDetails] = useState({})
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
    companyAPI.get(slug, currentGenre, currentPlatform, year, sortBy, sortOrder, page)
    .then(response => {
      document.title = `${response.name} | Arcade Archive`
      setCompanyDetails({ name: response.name, description: response.description })
      setCount(response.games[0].count[0].count)
      setResults(response.games[0].results)
      setLoading(false)
    })
    .catch(error => throwError(error))
  }, [slug, currentGenre, currentPlatform, page, sortBy, sortOrder, year])

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
      <div className="flex flex-col gap-4 animate-[pulse_1s_linear_infinite]">
        <div className="flex flex-col gap-2 text-white">
          <div className="flex flex-col gap-2 pb-2">
            <div className="w-20 h-6 placeholder" />
            <div className="w-96 h-10 placeholder" />
            <div className="flex w-full flex-col gap-2">
              {Array.apply(null, Array(Math.floor(Math.random() * 3) + 1)).map((_, index) => (
                <div key={index} className={`h-6 placeholder`} style={{ width: `${Math.floor(Math.random() * 21) + 80}%`}}/>
              ))}
            </div>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {Array.apply(null, Array(Math.floor(Math.random() * 3) + 1)).map((_, index) => (
                <div key={index} className="h-6 w-32 placeholder" />
              ))}
            </div>
            <div className="flex w-full justify-between">
              <div className="flex justify-center items-end text-white/50 font-light text-sm">{count.toLocaleString()} Games</div>
              <div className="flex gap-2">
                <div className="w-40 h-6 placeholder" />
                <div className="w-12 h-6 placeholder" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2"> 
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.apply(null, Array(35)).map((_, index) => (
                <div key={index} className={`flex flex-col items-center gap-2`}>
                  <div className="relative h-48 aspect-[45/64] placeholder" />
                  {sortBy == "releaseDate" || sortBy == "avgRating" ? <div className="w-20 h-6 placeholder" /> : <></>}
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
      </div>
    )
  }

  return (
    <div className="grid grid-flow-row auto-rows-max gap-2 pb-8 text-white">
      {/* Name and Summary */}
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-light text-white/50">Company</p>
          <p className="text-3xl mb-2 font-semibold">{companyDetails.name}</p>
          <p className="font-light text-white/75">{companyDetails.description != "N/A" ? companyDetails.description : ""}</p>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
      </div>
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
        <Pagination page={page} count={count} update={updateQueryParameter} />
      </div>
    </div>
  )
}

export default Company