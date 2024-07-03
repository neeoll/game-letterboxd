import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import GameDisplay from "../components/GameDisplay"

const GamesBySeries = () => {
  const { seriesId } = useParams()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/series/${seriesId}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.log(message)
        return
      }
      const json = await response.json()
      
      console.log(json)
      
      setResults(json)
      setLoading(false)
    }
    gameSearch()
  }, [seriesId])

  return(
    <div>
      <div className="flex flex-col mx-52 pb-4 text-white border-b border-white/50">
        <p className="text-sm font-light text-white/50">Series</p>
        <p className="text-3xl font-semibold">{results.name}</p>
      </div>
      <GameDisplay additionalFilter={`collections = ${seriesId}`} />
    </div>
  )
}

export default GamesBySeries