import { useEffect, useState } from "react"
import { useLocation, Link, useOutletContext } from "react-router-dom"
import { RxStarFilled } from "react-icons/rx"
import { platforms } from "../dict"
import { Sort } from "../components"
import { gameAPI } from "../api"

const Search = () => {
  const location = useLocation()
  const ref = useOutletContext()
  const searchText = new URLSearchParams(location.search).get("title")
  
  const [results, setResults] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [sortBy, setSortBy] = useState("avgRating")
  const [sortOrder, setSortOrder] = useState(-1)

  useEffect(() => {
    ref.current.scrollTo(0, 0)
    document.title = `Search - ${searchText} | Arcade Archive`
    gameAPI.search(encodeURIComponent(searchText))
    .then(response => {
      setCount(response.count[0].count)
      setResults(response.results)
      setLoading(false)
    })
    .catch(error => {
      console.error(error)
    })
  }, [searchText])

  const updateSort = (params) => {
    params.forEach(item => {
      if (item.params == "sortBy") { return setSortBy(item.value) }
      else { return setSortOrder(item.value) }
    })
  }

  const handleSort = (a, b) => {
    if (a[sortBy] < b[sortBy]) return -1 * sortOrder
    if (a[sortBy] > b[sortBy]) return 1 * sortOrder
    return 0
  }

  if (loading) {
    return (
      <div className="flex flex-col h-fit gap-4 animate-[pulse_1s_linear_infinite]">
        <div className="flex justify-center">
          <div className="h-10 w-96 placeholder" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.apply(null, Array(10)).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-36 aspect-[45/64] placeholder" />
                <div className="flex flex-col h-32 justify-start gap-2">
                  <div className="h-8 w-72 placeholder" />
                  <div className="h-6 w-48 placeholder" />
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
      <div className="flex gap-2">
        <Sort criteria={searchSortCriteria} sortBy={sortBy} sortOrder={sortOrder} update={updateSort} />
      </div>
      <div className="flex flex-col gap-2">
        {results.sort(handleSort).map((game, index) => (
          <div key={index} className="flex flex-col gap-2 group">
            <div className="flex items-center h-24 gap-2">
              <div className="h-full w-fit">
                <img loading="lazy" className="size-full object-cover object-center aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`} />
              </div>
              <div className="flex flex-col h-full justify-start gap-1">
                <Link to={`/game/${game.slug}`} className="flex gap-1 text-white text-2xl hover:bg-gradient-to-r from-accentPrimary to-accentSecondary hover:bg-clip-text hover:text-transparent group/link">
                  <p>{game.name} <span className="text-white/75 group-hover/link:text-transparent">({new Date(game.releaseDate * 1000).getFullYear()})</span></p>
                </Link>
                <div className="flex items-center text-lg text-white/75 gap-1">
                  <RxStarFilled /><p>{(game.avgRating || 0).toFixed(1)}</p>
                </div>
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

const searchSortCriteria = [
  { name: "Avg. Rating", value: "avgRating" },
  { name: "Name", value: "name" },
  { name: "Release Date", value: "releaseDate" }
]

export default Search