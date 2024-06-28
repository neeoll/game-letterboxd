import _debounce from "debounce"
import { useEffect, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { Link, useNavigate } from "react-router-dom"
import { RxMagnifyingGlass } from 'react-icons/rx'

export default function Navbar() {

  const [searchText, setSearchText] = useState("")
  const textDebounce = _debounce((text) => setSearchText(text), 500)
  const [games, setGames] = useState([])
  const [loggedIn, setLoginStatus] = useState(false)
  
  let navigate = useNavigate()

  useEffect(() => {
    if (searchText == "") return
    async function getGames() {
      const response = await fetch(`http://127.0.0.1:5050/game/search?title=${searchText}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      console.log(json)
      setGames(json)
    }
    getGames()
    return
  }, [searchText])

  const resetNavbar = () => {
    setSearchText("")
    setGames([])
  }

  return (
    <nav className="items-center p-4 w-full">
      <div className="flex gap-2 p-2 items-center">
        <div className="flex flex-row">
          <Combobox 
            onChange={(value) => { 
              if (value != null) navigate(`/game/${value}`)
            }} 
            onClose={resetNavbar}
          >
            <ComboboxInput
              type="text"
              className="h-8 rounded-l min-w-96 h-10 p-1 border-r border-neutral-950 text-sm text-white/75 bg-neutral-700"
              onChange={e => textDebounce(e.target.value)}
              placeholder="Search"
              onKeyDown={e => { if (e.key === 'Enter') navigate({pathname: "/games/search", search: `?title=${e.target.value}`}) }}
              autoComplete="new-password"
            />
            <ComboboxOptions anchor="bottom start" className="bg-neutral-800 p-1">
              {games.length > 0 ? games.map((game) => (
                <ComboboxOption key={game.id} value={game.id} className="w-auto">
                  <div className="min-w-fit flex items-center gap-2 p-1 rounded hover:bg-neutral-950 hover:cursor-pointer">
                    <div className="w-10 min-w-10 h-10 min-h-10 flex justify-center items-center">
                      <img className="max-w-full max-h-full rounded" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg` : ""} />
                    </div>
                    <h1 className="text-white text-sm min-w-fit">
                      {`${game.name} `}
                      <span className="text-white/75">
                        {` (${new Date(game.first_release_date * 1000).getFullYear()})`}
                      </span>
                    </h1>
                  </div>
                </ComboboxOption>
              )) : "Loading..."}
            </ComboboxOptions>
          </Combobox>
          <button className="h-8 p-1 bg-neutral-700 rounded-r"><RxMagnifyingGlass size="1.5em" color="gray" /></button>
        </div>
        <Link to={"TODO"} className="text-white/75 hover:text-white">{loggedIn ? "Profile" : "Login/Register"}</Link>
        <Link to={"/games"} className="text-white/75 hover:text-white">Games</Link>
      </div>
    </nav>
  );
}