import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { RxMagnifyingGlass } from 'react-icons/rx'
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import _debounce from "debounce"

export default function Navbar() {

  const textDebounce = _debounce((text) => getGames(text), 300)
  const [games, setGames] = useState([])
  const [userData, setUserData] = useState(false)
  
  let navigate = useNavigate()

  useEffect(() => {
    async function getUserInfo() {
      const token = localStorage.getItem('jwt-token')
      if (!token) return
      try {
        const response = await fetch('http://127.0.0.1:5050/auth/getUser', {
          headers: {
            'authorization': token
          }
        })
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getUserInfo()
    return
  }, [])

  const getGames = async (searchText) => {
    if (searchText == "") return
    const response = await fetch(`http://127.0.0.1:5050/game/search?title=${searchText}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      setGames(json)
  }

  const resetNavbar = () => {
    setGames([])
  }

  return (
    <nav className="absolute z-10 inset-0 items-center w-full h-fit py-6">
      <div className="flex flex-row-reverse gap-4 px-12 items-center">
        <div className="flex flex-row">
          <Combobox 
            onChange={(value) => { 
              if (value != null) navigate(`/game/${value}`)
            }}
            onClose={resetNavbar}
          >
            <ComboboxInput
              type="text"
              className="h-8 rounded-l min-w-72 h-10 p-2 border-neutral-950 text-sm text-white/75 bg-neutral-800 focus:outline-none"
              onChange={e => textDebounce(e.target.value)}
              placeholder="Search"
              onKeyDown={e => { if (e.key === 'Enter') navigate({pathname: "/games/search", search: `?title=${e.target.value}`}) }}
              autoComplete="new-password"
            />
            <ComboboxOptions anchor="bottom start" className="bg-neutral-800" static={true}>
              <SimpleBar style={{ maxHeight: 300, width: '18rem' }}>
                {games.length > 0 ? games.map((game) => (
                  <ComboboxOption key={game.id} value={game.id} className="px-1 rounded-md hover:bg-neutral-950 hover:cursor-pointer">
                      <div className="p-1 flex w-full items-center border-b border-white/25">
                        <div className="w-8 min-w-8 h-8 min-h-8 flex justify-center items-center">
                          <img className="max-w-full max-h-full rounded" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg` : ""} />
                        </div>
                        <h1 className="text-white text-xs text-wrap">
                          {`${game.name} `}
                          <span className="text-white/75">
                            {` (${new Date(game.first_release_date * 1000).getFullYear()})`}
                          </span>
                        </h1>
                      </div>
                  </ComboboxOption>
                )) : <></>}
              </SimpleBar>
            </ComboboxOptions>
          </Combobox>
          <button className="flex justify-center items-center h-8 w-8 p-1 bg-neutral-800 rounded-r text-white/50 hover:text-white"><RxMagnifyingGlass size="1.25em" /></button>
        </div>
        <Link to={"/games"} className="text-white/75 hover:text-white">Games</Link>
        {userData ? 
          (
            <Link to={"TODO"} className="text-white/75 hover:text-white">Profile</Link>
          ) :
          (
            <div className="flex gap-2">
              <Link to={"/register"} className="text-white/75 hover:text-white">Register</Link>
              <Link to={"/login"} className="text-white/75 hover:text-white">Login</Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}