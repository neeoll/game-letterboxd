import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import 'simplebar-react/dist/simplebar.min.css';
import DropdownSearch from "./DropdownSearch";
import PropTypes from 'prop-types'

const FilterSidebar = (props) => {
  const [currentGenre, setGenre] = useState(props.genre || -1)
  const [currentPlatform, setPlatform] = useState(props.platform || -1)
  const [year, setYear] = useState(props.year || 0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const applyQueryParams = () => {
    props.update([
      { params: "year", value: year },
      { params: "genre", value: currentGenre },
      { params: "platform", value: currentPlatform },
    ])
    setSidebarOpen(false)
  }

  const clearQueryParams = () => {
    setYear(0)
    setGenre(-1)
    setPlatform(-1)
  }

  return (
    <div className="flex justify-center items-center">
      <button onClick={() => setSidebarOpen(true)} className="hover:bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text hover:text-transparent text-sm text-white/50 font-bold">Filters</button>
      <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-gradient-to-t from-[#ff990055] to-[#ff00ff33]">
          <DialogPanel>
            <div className={`flex flex-col w-96 p-6 gap-4 rounded-lg bg-neutral-900 text-white/75`}>
              {/* Year Filter */}
              <div>
                <p className="text-xl font-light pb-1">Release Year</p>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <input onChange={(e) => {setYear(e.target.value)}} min="1950" max="2100" placeholder="Custom Year" type="number" className="flex col-start-1 col-end-3 rounded p-0.5 justify-center p-1 bg-neutral-700 border-none focus:border-white"/>
                  <div className="relative flex group col-start-1 col-end-2">
                    <div className={`absolute flex w-full h-full rounded p-0.5 justify-center group-hover:bg-gradient-to-r from-accentPrimary to-accentSecondary blur-sm ${year == 1 ? "bg-gradient-to-r" : ""}`} />
                    <button onClick={() => setYear(1)} className={`relative flex w-full h-full rounded p-0.5 justify-center bg-neutral-900`}>Unreleased</button>
                  </div>
                  <div className="relative flex group col-start-2 col-end-3">
                    <div className={`absolute flex w-full h-full rounded p-0.5 justify-center group-hover:bg-gradient-to-r from-accentPrimary to-accentSecondary blur-sm ${year == 0 ? "bg-gradient-to-r" : ""}`} />
                    <button onClick={() => setYear(0)} className={`relative flex w-full h-full rounded p-0.5 justify-center bg-neutral-900`}>Released</button>
                  </div>
                </div>
              </div>
              {/* Genre Filter */}
              <div>
                <p className="text-xl font-light pb-1">Genre</p>
                <DropdownSearch array={props.genres} value={currentGenre} setValue={setGenre} />
              </div>
              {/* Platform Filter */}
              <div>
                <p className="text-xl font-light pb-1">Platform</p>
                <DropdownSearch array={props.platforms} value={currentPlatform} setValue={setPlatform} />
              </div>
              <div className="flex gap-2">
                <div className="relative group basis-1/2">
                  <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1"></div>
                  <button onClick={() => applyQueryParams()} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Apply Filters</button>
                </div>
                <button onClick={() => clearQueryParams()} className="basis-1/2 rounded bg-neutral-600 text-white hover:bg-red-700">Clear</button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

FilterSidebar.propTypes = {
  year: PropTypes.number,
  genre: PropTypes.number,
  platform: PropTypes.number,
  update: PropTypes.func,
  genres: PropTypes.array,
  platforms: PropTypes.array
}

export default FilterSidebar