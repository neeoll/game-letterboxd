import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Dialog, DialogPanel, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { RxCaretDown, RxCross2, RxStarFilled, RxTriangleDown, RxTriangleUp } from "react-icons/rx"
import moment from "moment"
import FilterSidebar from "./FilterSidebar"
import { genres, platforms, sort_criteria } from "../dict"
import Pagination from "./Pagination"

const GameDisplay = (props) => {
  const [count, setCount] = useState(0)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({ genre: props.genre || null, platform: props.platform || null, year: props.year || null})
  const [sort, setSort] = useState({ criteria: sort_criteria[props.defaultSort || 0], direction: 0 })

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game?genre=${filters.genre || 0}&platform=${filters.platform || 0}&year=${filters.year || 0}&sortCriteria=${sort.criteria.value}&sortDirection=${sort.direction}&page=${page}&additionalFilter=${props.additionalFilter}`)

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        alert(message)
        return
      }
      const json = await response.json()
      
      setCount(json[0].count)
      setResults(json[1].result)
      setLoading(false)
    }
    gameSearch()
  }, [filters, sort, page])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return(
    <>
      <div className="px-52">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {filters.year != null ? (
            <button onClick={() => setFilters({...filters, year: null})} className="flex text-xs font-semibold text-neutral-300 bg-gray-700 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-indigo-400 hover:text-white">
              <RxCross2 className="border rounded-full" size={"1.25em"}/>
              <p>Release Year: {filters.year == 0 ? "Released" : filters.year == 1 ? "Unreleased" : filters.year}</p>
            </button>
          ) : ""}
          {filters.genre != null ? (
            <button onClick={() => setFilters({...filters, genre: null})} className="flex text-xs font-semibold text-neutral-300 bg-gray-700 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-indigo-400 hover:text-white">
              <RxCross2 className="border rounded-full" size={"1.25em"}/>
              <p>Genre: {genres.find(genre => genre.id === filters.genre).name}</p>
            </button>
          ) : ""}
          {filters.platform != null ? (
            <button onClick={() => setFilters({...filters, platform: null})} className="flex text-xs font-semibold text-neutral-300 bg-gray-700 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-indigo-400 hover:text-white">
              <RxCross2 className="border rounded-full" size={"1.25em"}/>
              <p>Platform: {platforms.find(platform => platform.id === filters.platform).name}</p>
            </button>
          ) : ""}
        </div>
        {/* Game Count and Sort/Filter Options */}
        <div className="flex w-full justify-between">
          <div className="flex justify-center items-end text-white/50 font-light text-sm">{count.toLocaleString()} Games</div>
          <div className="flex justify-end gap-2">
            <div className="flex w-fit items-center">
              <p className="text-white/50 text-sm font-light text-nowrap">Sort By</p>
              <button onClick={() => {setSort({...sort, direction: (sort.direction == 0 ? 1 : 0)})}} className="flex flex-col">
                <RxTriangleUp className={`${sort.direction == 1 ? "text-white" : "text-white/50"} text-2xl -mb-2`}/>
                <RxTriangleDown className={`${sort.direction == 0 ? "text-white" : "text-white/50"} text-2xl -mt-2`}/>
              </button>
              <Listbox value={sort.criteria} onChange={(value) => { if (value != null) setSort({...sort, criteria: value}) }}>
                <ListboxButton className="flex text-white items-center gap-1 w-full text-sm">{sort.criteria.name}<RxCaretDown /></ListboxButton>
                <ListboxOptions anchor="bottom" className="rounded bg-gray-800 text-xs">
                  {
                    sort_criteria.map((criteria) => (
                      <ListboxOption key={criteria.id} value={criteria} className="w-full p-1 hover:bg-gray-400">
                        <p className="text-white">{criteria.name}</p>
                      </ListboxOption>
                    ))
                  }
                </ListboxOptions>
              </Listbox>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="text-sm text-indigo-500 font-bold">Filters</button>
            <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50">
              <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-neutral-900/75">
                <DialogPanel>
                  <FilterSidebar filters={filters} setFilters={setFilters} setSidebarOpen={setSidebarOpen} />
                </DialogPanel>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2"> 
        <div className="flex flex-wrap gap-4 justify-start px-52">
          {results.map(game =>
            <div key={game.id} className="flex flex-col items-center gap-1">
              <Link key={game.id} to={`/game/${game.id}`} className="relative h-56 group hover:rounded hover:outline hover:outline-4 hover:outline-indigo-500 hover:outline-offset-[-3px]">
                <img loading="lazy" className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg` : ""} />
                <p className="flex absolute inset-0 p-0.5 items-center justify-center text-center font-semibold text-white w-full h-full invisible group-hover:visible">{game.name}</p>
              </Link>
              {sort.criteria.id == 2 ? 
                <div className="w-fit h-fit flex justify-center items-center text-white/75 gap-1 text-sm rounded outline outline-1 px-1 py-0.5">
                  {moment.unix(game.first_release_date).format("MM-D-YYYY")}
                </div> : <></>
              }
              {sort.criteria.id == 3 ?
                <div className="w-fit h-fit flex justify-center items-center text-white/75 gap-1 text-sm rounded outline outline-1 px-1 py-0.5">
                  <RxStarFilled />{((game.total_rating / 100) * 5).toFixed(1)}
                </div> : <></>
              }
            </div>
          )}
        </div>
        <Pagination page={page} count={count} setPage={setPage} />
      </div>
    </>
  )
}

export default GameDisplay