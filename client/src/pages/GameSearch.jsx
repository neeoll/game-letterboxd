import Navbar from "../components/Navbar"
import GameDisplay from "../components/GameDisplay"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const GameSearch = () => {
  const location = useLocation()
  
  const [params, setParams] = useState({ genre: null, platform: null, year: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAllURLParams = () => {
      setLoading(true)
      const urlSearchParams = new URLSearchParams(location.search)
      const paramsObject = { genre: null, platform: null, year: null }

      urlSearchParams.forEach((value, key) => {
        paramsObject[key] = parseInt(value)
      })

      console.log(paramsObject)

      setParams(paramsObject)
      setLoading(false)
    }

    getAllURLParams()
  }, [])

  return(
    <div>
      {loading ? "Loading..." : <GameDisplay genre={params.genre} platform={params.platform} year={params.year} />}
    </div>
  )
}

export default GameSearch