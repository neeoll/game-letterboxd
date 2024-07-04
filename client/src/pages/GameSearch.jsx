import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { GameDisplay } from "../components"

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