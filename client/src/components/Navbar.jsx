import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { RxCaretDown } from 'react-icons/rx'
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import GlowingText from './GlowingText'
import _ from "lodash"
import { navbarDestinations } from '../dict'
import axios from 'axios'

export function Navbar() {

  const textDebounce = _.debounce((text) => getGames(text), 300)
  const [games, setGames] = useState([])
  const [userData, setUserData] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  let navigate = useNavigate()

  useEffect(() => {
    async function getUserInfo() {
      if (!localStorage.getItem('jwt-token')) return
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/getUser`, {
        headers: { 
          'authorization': localStorage.getItem('jwt-token') 
        }
      })
      .then(res => setUserData(res.data))
      .catch(err => console.error(err))
    }
    getUserInfo()
    return
  }, [])

  const getGames = async (searchText) => {
    if (searchText == "") return
    axios.get(`http://127.0.0.1:5050/game/search?title=${encodeURIComponent(searchText)}`)
    .then(res => setGames(res.data.results))
    .catch(err => console.error(err))
  }

  const resetNavbar = () => { setGames([]) }

  function logout() {
    localStorage.removeItem('jwt-token')
    window.location.reload()
  }

  return (
    <nav className="absolute z-10 inset-0 items-center flex justify-between w-full h-fit py-6 px-12">
      <div className="flex gap-4">
        <GlowingText><Link to={"/"}>Arcade Archives</Link></GlowingText>
      </div>
      <div className="flex flex-row-reverse gap-3 items-center">
        <Combobox onChange={(value) => navigate(`/game/${value}`)} onClose={resetNavbar}>
          <ComboboxInput
            type="text"
            className="h-8 rounded min-w-72 h-10 p-2 border-indigo-950 text-sm text-indigo-50/75 bg-neutral-700 focus:outline-none data-[focus]"
            onChange={e => textDebounce(e.target.value)}
            placeholder="Search"
            onKeyDown={e => { if (e.key === 'Enter') navigate({pathname: "/games/search", search: `?title=${e.target.value}`}) }}
            autoComplete="new-password"
          />
          <ComboboxOptions anchor="bottom start" className="bg-neutral-700 mt-1 rounded">
            <SimpleBar style={{ maxHeight: 300, width: '18rem' }}>
              {games.length > 0 ? games.map((game) => (
                <ComboboxOption autoFocus={false} disabled={true} key={game.gameId} value={game.gameId} className="px-1 hover:bg-neutral-600 hover:cursor-pointer">
                  <div className="p-1 flex w-full items-center border-b border-amber-100/25">
                    <div className="w-8 min-w-8 h-8 min-h-8 flex justify-center items-center">
                      <img className="max-w-full max-h-full rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.coverId}.jpg`} />
                    </div>
                    <h1 className="text-indigo-50 text-xs text-wrap">
                      {`${game.name} `}
                      <span className="text-indigo-50/75">
                        {` (${new Date(game.releaseDate * 1000).getFullYear()})`}
                      </span>
                    </h1>
                  </div>
                </ComboboxOption>
              )) : <></>}
            </SimpleBar>
          </ComboboxOptions>
        </Combobox>
        <Link to={"/games"} className="text-indigo-50/75 hover:text-indigo-50">Games</Link>
        {userData ? 
          (
            <Menu>
              <MenuButton className="hover:cursor-default">
                <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} className="flex gap-1 justify-center items-center text-indigo-50/75 hover:text-indigo-50">{userData.username}<RxCaretDown size={"1.25rem"}/></div>
              </MenuButton>
              <MenuItems onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} static={menuOpen} anchor="bottom center">
                <div className="bg-neutral-800 rounded mt-1">
                  {navbarDestinations.map((destination, index) => (
                    <MenuItem key={index}>
                      <Link onClick={() => setMenuOpen(false)} to={destination.route} className="flex w-full first:rounded-t justify-start text-indigo-50/75 py-1.5 px-4 text-sm block hover:bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
                        {destination.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <button 
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }} 
                      className="flex w-full justify-start text-indigo-50/75 py-1.5 px-4 text-sm block rounded-b hover:bg-red-500"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) :
          (
            <div className="flex gap-2">
              <Link to={"/register"} className="text-indigo-50/75 hover:text-indigo-50">Register</Link>
              <Link to={"/login"} className="text-indigo-50/75 hover:text-indigo-50">Login</Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar