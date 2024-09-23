import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { RxCaretDown } from 'react-icons/rx'
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import _ from "lodash"
import axios from 'axios'
import { getYearFromTimestamp } from '../utils'

const Navbar = () => {
  const navigate = useNavigate()
  const searchbar = useRef(null)
  const textDebounce = _.debounce((text) => search(text), 300)
  const [results, setResults] = useState([])
  const [userData, setUserData] = useState()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function getUserInfo() {
      axios.get('/auth/getUser')
      .then(res => setUserData(res.data))
      .catch(err => console.error(err))
    }
    getUserInfo()
    return
  }, [])

  const search = async (searchText) => {
    if (searchText == "") { return setResults([]) }
    axios.get(`/game/search?title=${encodeURIComponent(searchText)}`)
    .then(res => {
      setResults(res.data.results)
    })
    .catch(err => console.error(err))
  }

  const handleSearch = () => {
    navigate({ pathname: "/games/search", search: `?title=${encodeURIComponent(search.current.value)}` })
    search.current.value = ""
    search.current.blur()
    setResults([])
  }

  const resetResults = () => {
    search.current.value = ""
    search.current.blur()
    setResults([])
  }

  function logout() {
    setMenuOpen(false)
    window.localStorage.removeItem('accessToken')
    window.location.reload()
  }

  return (
    <nav className="absolute z-10 inset-0 items-center flex justify-between w-full h-fit py-4 px-52 bg-gradient-to-b from-neutral-900">
      {/* Title */}
      {window.location.pathname != "/" ? (
        <div className="flex font-edunline group text-4xl text-transparent">
          <span className="absolute bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text group-hover:blur-sm">
            <p>Arcade Archive</p>
          </span>
          <h1 className="relative bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
            <Link to={"/"}>Arcade Archive</Link>
          </h1>
        </div>
      ) : (
        <div />
      )}
      <div className="flex gap-4 items-center">
        {userData ? 
          (
            <div className="relative">
              <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} className="flex gap-1 w-20 justify-center items-center text-white/75 hover:text-white">{userData.username}<RxCaretDown className="text-lg" /></div>
              <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} className={`absolute w-full pt-1 ${menuOpen == true ? "visible": "invisible"}`}>
                <div className="flex flex-col items-center bg-neutral-800 rounded text-white">
                  {navbarDestinations.map((destination, index) => (
                    <Link key={index} onClick={() => setMenuOpen(false)} to={destination.route} className="w-full text-center py-1.5 px-4 first:rounded-t text-sm hover:bg-gradient-to-r from-accentPrimary to-accentSecondary">
                      {destination.name}
                    </Link>
                  ))}
                  <button onClick={() => logout()} className="w-full text-center py-1.5 px-4 text-sm rounded-b hover:bg-red-500">Logout</button>
                </div>
              </div>
            </div>
          ) :
          (
            <div className="flex gap-4">
              <Link to={"/register"} className="text-white/75 hover:text-white">Register</Link>
              <Link to={"/login"} className="text-white/75 hover:text-white">Login</Link>
            </div>
          )
        }
        <Link to={"/games"} className="text-white/75 hover:text-white">Games</Link>
        <div className="relative group/searchbar">
          <input
            ref={searchbar}
            type="text"
            className="w-80 h-8 rounded p-2 text-sm text-white bg-neutral-700 outline-none"
            onChange={e => textDebounce(e.target.value)}
            placeholder="Search"
            onKeyDown={e => { 
              if (e.key === 'Enter') { handleSearch() }
            }}
            autoComplete="new-password"
          />
          <div className="absolute w-full top-10 invisible group-focus-within/searchbar:visible">
            {results.length == 0 ? 
              <div className="w-full bg-neutral-700 p-1.5 flex justify-center rounded text-white/50 font-light text-sm">No results.</div> : 
              <div className="w-full bg-neutral-700 rounded">
                <SimpleBar style={{ maxHeight: 300 }}>
                  {results.map((result, index) => (
                    <Link key={index} to={`/game/${result.slug}`} onClick={() => resetResults()}>
                      <div className="grid grid-cols-9 p-1 items-center hover:bg-neutral-600">
                        <div className="col-span-1 h-10">
                          <img className="h-full object-cover aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${result.coverId}.jpg`} />
                        </div>
                        <div className="col-span-8 text-white text-xs text-wrap">
                          {`${result.name} `}
                          <span className="text-white/75">
                            {`(${getYearFromTimestamp(result.releaseDate)})`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </SimpleBar>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  )
}

const navbarDestinations = [
  { route: "/profile", name: "Profile" },
  { route: "/settings", name: "Settings" }
]

export default Navbar