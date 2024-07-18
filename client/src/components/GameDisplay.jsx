import { useState } from "react"
import { Dialog, DialogPanel, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { RxCaretDown, RxCross2, RxTriangleDown, RxTriangleUp } from "react-icons/rx"
import FilterSidebar from "./FilterSidebar"
import { genres, platforms, sort_criteria } from "../dict"
import Pagination from "./Pagination"
import GameCard from "./GameCard"
import { useSearchParams } from "react-router-dom"

const GameDisplay = (props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const year = parseInt(searchParams.get('year') || '0')
  const currentGenre = parseInt(searchParams.get('genre') || '0')
  const currentPlatform = parseInt(searchParams.get('platform') || '0')
  const sortBy = searchParams.get('sortBy') || "release_date"
  const sortOrder = parseInt(searchParams.get('sortOrder') || '-1')

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
    <div className="flex flex-col gap-2">
      <div className="px-52">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {year != null ? (
            <button onClick={() => removeQueryParameter('year')} className="flex text-xs font-semibold text-indigo-300 bg-indigo-800 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-amber-400 hover:text-amber-200 group">
              <RxCross2 className="border rounded-full group-hover:border-amber-300" size={"1.25em"}/>
              <p>Release Year: {year == 0 ? "Released" : year == 1 ? "Unreleased" : year}</p>
            </button>
          ) : ""}
          {currentGenre != 0 ? (
            <button onClick={() => removeQueryParameter('genre')} className="flex text-xs font-semibold text-indigo-300 bg-indigo-800 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-amber-400 hover:text-amber-200 group">
              <RxCross2 className="border rounded-full group-hover:border-amber-300" size={"1.25em"}/>
              <p>Genre: {genres.find(genre => genre.id === currentGenre).name}</p>
            </button>
          ) : ""}
          {currentPlatform != 0 ? (
            <button onClick={() => removeQueryParameter('platform')} className="flex text-xs font-semibold text-indigo-300 bg-indigo-800 outline outline-1 rounded-xl p-1 px-2 gap-2 items-center hover:outline-amber-400 hover:text-amber-200 group">
              <RxCross2 className="border rounded-full group-hover:border-amber-300" size={"1.25em"}/>
              <p>Platform: {platforms.find(platform => platform.id === currentPlatform).name}</p>
            </button>
          ) : ""}
        </div>
        {/* Game Count and Sort/Filter Options */}
        <div className="flex w-full justify-between">
          <div className="flex justify-center items-end text-indigo-50/50 font-light text-sm">{props.count.toLocaleString()} Games</div>
          <div className="flex justify-end gap-2">
            <div className="flex w-fit items-center">
              <p className="text-indigo-50/50 text-sm font-light text-nowrap">Sort By</p>
              <button onClick={() => updateQueryParameter('sortOrder', (sortOrder == -1 ? 1 : -1))} className="flex flex-col">
                <RxTriangleUp className={`${sortOrder == 1 ? "text-indigo-50" : "text-indigo-50/50"} text-2xl -mb-2`}/>
                <RxTriangleDown className={`${sortOrder == -1 ? "text-indigo-50" : "text-indigo-50/50"} text-2xl -mt-2`}/>
              </button>
              <Listbox value={sort_criteria.find(sort => sort.value == sortBy)} onChange={(value) => { if (value != null) updateQueryParameter('sortBy', value.value) }}>
                <ListboxButton className="flex text-indigo-50 items-center gap-1 w-full text-sm">{sort_criteria.find(sort => sort.value == sortBy).name}<RxCaretDown /></ListboxButton>
                <ListboxOptions anchor="bottom" className="rounded bg-gray-800 text-xs">
                  {
                    sort_criteria.map((criteria) => (
                      <ListboxOption key={criteria.id} value={criteria} className="w-full p-1 hover:bg-gray-400">
                        <p className="text-indigo-50">{criteria.name}</p>
                      </ListboxOption>
                    ))
                  }
                </ListboxOptions>
              </Listbox>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="text-sm text-indigo-500 font-bold">Filters</button>
            <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50">
              <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-indigo-900/75">
                <DialogPanel>
                  <FilterSidebar setSidebarOpen={setSidebarOpen} />
                </DialogPanel>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2"> 
        <div className="flex flex-wrap gap-4 justify-start px-52">
          {props.results.map(game =>
            <GameCard game={game} sortBy={sortBy} />
          )}
        </div>
        <Pagination count={props.count} />
      </div>
    </div>
  )
}

export default GameDisplay