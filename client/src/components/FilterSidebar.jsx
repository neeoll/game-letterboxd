import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { genres, platforms } from '../dict';

export function FilterSidebar(props) {
  const [genre, setGenre] = useState(genres.find(genre => genre.id === props.filters.genre) || {})
  const [platform, setPlatform] = useState(platforms.find(platform => platform.id === props.filters.platform) || {})
  const [year, setYear] = useState(props.filters.year || 0)
  
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

  return (
    <div className={`flex flex-col absolute inset-0 h-screen w-60 p-4 gap-4 bg-neutral-800 text-neutral-300`}>
      <p className="text-3xl font-light border-b border-neutral-300 pb-2">Filters</p>
      <div>
        <p className="text-xl font-light pb-2">Release Year</p>
        <div className="grid grid-cols-4 grid-rows-2 gap-1">
          <button onClick={() => setYear(1)} className={`flex col-start-1 col-end-3 rounded border p-0.5 justify-center hover:border-indigo-500 ${year == 1 ? "border-indigo-500" : ""}`}>Unreleased</button>
          <button onClick={() => setYear(0)} className={`flex col-start-3 col-end-5 rounded border p-0.5 justify-center hover:border-indigo-500 ${year == 0 ? "border-indigo-500" : ""}`}>Released</button>
          <button onClick={() => setYear(2023)} className={`flex rounded border p-0.5 justify-center hover:border-indigo-500 ${year == 2023 ? "border-indigo-500" : ""}`}>2023</button>
          <button onClick={() => setYear(2024)} className={`flex rounded border p-0.5 justify-center hover:border-indigo-500 ${year == 2024 ? "border-indigo-500" : ""}`}>2024</button>
          <input onChange={(e) => {setYear(e.target.value)}} min="1950" max="2100" placeholder="Custom Year" type="number" className="flex col-start-3 col-end-5 rounded border p-0.5 justify-center p-1 border-neutral-300 bg-gray-600"/>
        </div>
      </div>
      <div>
        <p className="text-xl font-light pb-2">Genre</p>
        <Combobox value={genre} onChange={(value) => { if (value != null) setGenre(value) }} onClose={() => setGenreQuery('')}>
          <ComboboxInput
            className="h-8 rounded w-full p-1 border-neutral-300 text-sm bg-gray-600"
            displayValue={(genre) => genre?.name}
            onChange={(e) => setGenreQuery(e.target.value)}
            placeholder="Genre"
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom" className="w-52 rounded bg-gray-600 mt-2">
            <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
              {
                filteredGenres.map((genre) => (
                  <ComboboxOption key={genre.id} value={genre} className="w-full p-1 hover:bg-gray-400">
                    <p className="text-white">{genre.name}</p>
                  </ComboboxOption>
                ))
              }
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
      </div>
      <div>
        <p className="text-xl font-light pb-2">Platform</p>
        <Combobox value={platform} onChange={(value) => { if (value != null) setPlatform(value) }} onClose={() => setPlatformQuery('')}>
          <ComboboxInput
            className="h-8 rounded w-full p-1 border-neutral-300 text-sm bg-gray-600"
            displayValue={(platform) => platform?.name}
            onChange={(e) => setPlatformQuery(e.target.value)}
            placeholder="Platform"
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom" className="w-52 rounded bg-gray-600 mt-2">
            <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
              {
                filteredPlatforms.map((platform) => (
                  <ComboboxOption key={platform.id} value={platform} className="w-full p-1 hover:bg-gray-400">
                    <p className="text-white">{platform.name}</p>
                  </ComboboxOption>
                ))
              }
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
      </div>
      <div className="flex flex-col gap-2">
        <button 
        onClick={() => {
          props.setFilters({ genre: genre.id || null, platform: platform.id || null, year: year})
          props.setSidebarOpen(false)
        }} 
        className="w-full h-8 rounded bg-indigo-500 text-white"
        >
          Apply Filters
        </button>
        <button
        onClick={() => {
          setGenre(null)
          setPlatform(null)
          setYear(null)
        }}
        className="w-full h-6 rounded bg-gray-500 text-white"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar