import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { RxCaretDown } from 'react-icons/rx'
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import _ from "lodash"
import { navbarDestinations } from '../dict'
import axios from 'axios'

const Navbar = () => {
  const textDebounce = _.debounce((text) => getGames(text), 300)
  const [games, setGames] = useState([])
  const [userData, setUserData] = useState()
  const [menuOpen, setMenuOpen] = useState(false)
  
  let navigate = useNavigate()

  useEffect(() => {
    async function getUserInfo() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/getUser`, {
        withCredentials: true
      })
      .then(res => setUserData(res.data))
      .catch(err => {
        if (err.response.status == 401) {
          return
        }
      })
    }
    getUserInfo()
    return
  }, [])

  const getGames = async (searchText) => {
    if (searchText == "") return
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/search?title=${encodeURIComponent(searchText)}`)
    .then(res => setGames(res.data.results))
    .catch(err => console.error(err))
  }

  const resetNavbar = () => { setGames([]) }

  function logout() {
    setMenuOpen(false)
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      withCredentials: true
    })
    .then(window.location.reload())
    .catch(err => console.error(err))
  }

  return (
    <nav className="absolute z-10 inset-0 items-center flex justify-between w-full h-fit py-6 px-52 bg-gradient-to-b from-neutral-900 from-10% to-transparent">
      {/* Title */}
      <div className="flex font-edunline group text-4xl text-transparent">
        <span className="absolute bg-gradient-to-t from-accentPrimary to-accentSecondary bg-clip-text group-hover:blur-sm">
          <p>Arcade Archives</p>
        </span>
        <h1 className="relative bg-gradient-to-t from-accentPrimary to-accentSecondary bg-clip-text">
          <Link to={"/"}>Arcade Archives</Link>
        </h1>
      </div>
      <div className="flex gap-4 items-center">
        {userData ? 
          (
            <Menu>
              <MenuButton className="cursor-default">
                <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} className="flex gap-1 items-center text-white/75 hover:text-white">{userData.username}<RxCaretDown className="text-lg" /></div>
              </MenuButton>
              <MenuItems onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} static={menuOpen} anchor="bottom center">
                <div className="flex flex-col bg-neutral-800 text-white rounded mt-1 text-center">
                  {navbarDestinations.map((destination, index) => (
                    <MenuItem key={index}>
                      <Link onClick={() => setMenuOpen(false)} to={destination.route} className="first:rounded-t py-1.5 px-4 text-sm hover:bg-gradient-to-r from-accentPrimary to-accentSecondary">
                        {destination.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <button onClick={() => logout()} className="py-1.5 px-4 text-sm rounded-b hover:bg-red-500">Logout</button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) :
          (
            <div className="flex gap-4">
              <Link to={"/register"} className="text-white/75 hover:text-white">Register</Link>
              <Link to={"/login"} className="text-white/75 hover:text-white">Login</Link>
            </div>
          )
        }
        <Link to={"/games"} className="text-white/75 hover:text-white">Games</Link>
        <Combobox onChange={(value) => navigate(`/game/${value}`)} onClose={resetNavbar}>
          <ComboboxInput
            type="text"
            className="w-72 h-8 rounded p-2 text-sm text-white bg-neutral-700 focus:outline-none data-[focus]"
            onChange={e => textDebounce(e.target.value)}
            placeholder="Search"
            onKeyDown={e => { if (e.key === 'Enter') navigate({pathname: "/games/search", search: `?title=${encodeURIComponent(e.target.value)}`}) }}
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom center" className="w-72 bg-neutral-700 mt-1 rounded">
            <SimpleBar style={{ maxHeight: 300 }}>
              {games.map(game => (
                <ComboboxOption autoFocus={false} disabled={true} key={game.gameId} value={game.gameId} className="px-1 hover:bg-neutral-600 hover:cursor-pointer">
                  <div className="p-1 flex w-full gap-2 items-center border-b border-white/50">
                    <div className="h-10 flex justify-center items-center">
                      <img className="w-full h-full object-cover aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.coverId}.jpg`} />
                    </div>
                    <h1 className="text-white text-xs text-wrap">
                      {`${game.name} `}
                      <span className="text-white/75">
                        {`(${new Date(game.releaseDate * 1000).getFullYear()})`}
                      </span>
                    </h1>
                  </div>
                </ComboboxOption>
              ))}
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
      </div>
    </nav>
  )
}

export default Navbar