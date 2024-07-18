import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { genres, platforms } from '../dict';
import { useSearchParams } from "react-router-dom";

export function FilterSidebar(props) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [currentGenre, setGenre] = useState(searchParams.get('genre') || 0)
  const [currentPlatform, setPlatform] = useState(searchParams.get('platform') || 0)
  const [year, setYear] = useState(searchParams.get('year') || 0)
  
  const [genreQuery, setGenreQuery] = useState("")
  const [platformQuery, setPlatformQuery] = useState("")

  const filteredGenres = 
    genreQuery === ''
      ? genres
      : genres.filter((genre) => {
          return genre.name.toLowerCase().includes(genreQuery.toLowerCase())
        })
  const filteredPlatforms = 
    platformQuery === ''
      ? platforms
      : platforms.filter((platform) => {
          return platform.name.toLowerCase().includes(platformQuery.toLowerCase())
        })

  const applyQueryParams = () => {
    const updatedParams = new URLSearchParams(location.search)

    updatedParams.set('year', year)
    updatedParams.set('genre', currentGenre)
    updatedParams.set('platform', currentPlatform)

    setSearchParams(updatedParams)
    props.setSidebarOpen(false)
  }

  const clearQueryParams = () => {
    const updatedParams = new URLSearchParams(location.search)

    updatedParams.delete('year')
    updatedParams.delete('genre')
    updatedParams.delete('platform')

    setSearchParams(updatedParams)
  }

  return (
    <div className={`flex flex-col absolute inset-0 h-screen w-60 p-4 gap-4 bg-indigo-950 text-white/75`}>
      {/* Year Filter */}
      <div>
        <p className="text-xl font-light pb-2">Release Year</p>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <button onClick={() => setYear(1)} className={`flex col-start-1 col-end-2 rounded border p-0.5 justify-center hover:border-amber-300 hover:text-amber-300 ${year == 1 ? "border-amber-300 shadow-[0_0_10px_2px_rgba(252,211,77,0.75)] text-amber-300" : ""}`}>Unreleased</button>
          <button onClick={() => setYear(0)} className={`flex col-start-2 col-end-3 rounded border p-0.5 justify-center hover:border-amber-300 hover:text-amber-300 ${year == 0 ? "border-amber-300 shadow-[0_0_10px_2px_rgba(252,211,77,0.75)] text-amber-300" : ""}`}>Released</button>
          <input onChange={(e) => {setYear(e.target.value)}} min="1950" max="2100" placeholder="Custom Year" type="number" className="flex col-start-1 col-end-3 rounded border p-0.5 justify-center p-1 border-indigo-300 bg-indigo-800"/>
        </div>
      </div>
      {/* Genre Filter */}
      <div>
        <p className="text-xl font-light pb-2">Genre</p>
        <Combobox value={genres.find(genre => genre.id == currentGenre)} onChange={(value) => { if (value != null) setGenre(value.id) }} onClose={() => setGenreQuery('')}>
          <ComboboxInput
            className="h-8 rounded w-full p-1 border-indigo-300 text-sm bg-indigo-800 text-amber-300"
            displayValue={(genre) => genre?.name}
            onChange={(e) => setGenreQuery(e.target.value)}
            placeholder="Genre"
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom" className="w-52 rounded bg-indigo-800 mt-2">
            <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
              {
                filteredGenres.map((genre) => (
                  <ComboboxOption key={genre.id} value={genre} className="w-full p-1 hover:bg-indigo-700">
                    <p className="text-amber-200">{genre.name}</p>
                  </ComboboxOption>
                ))
              }
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
      </div>
      {/* Platform Filter */}
      <div>
        <p className="text-xl font-light pb-2">Platform</p>
        <Combobox value={platforms.find(platform => platform.id == currentPlatform)} onChange={(value) => { if (value != null) setPlatform(value.id) }} onClose={() => setPlatformQuery('')}>
          <ComboboxInput
            className="h-8 rounded w-full p-1 border-indigo-300 text-sm bg-indigo-800 text-amber-300"
            displayValue={(platform) => platform?.name}
            onChange={(e) => setPlatformQuery(e.target.value)}
            placeholder="Platform"
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom" className="w-52 rounded bg-indigo-800 mt-2">
            <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
              {
                filteredPlatforms.map((platform) => (
                  <ComboboxOption key={platform.id} value={platform} className="w-full p-1 hover:bg-indigo-700">
                    <p className="text-amber-200">{platform.name}</p>
                  </ComboboxOption>
                ))
              }
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={() => applyQueryParams()} className="w-full h-8 rounded bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:text-amber-300">Apply Filters</button>
        <button onClick={() => clearQueryParams()} className="w-full h-6 rounded bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:text-amber-300">Clear</button>
      </div>
    </div>
  )
}

export default FilterSidebar