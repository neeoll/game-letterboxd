import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import GameDisplay from "../components/GameDisplay"

const GamesByCompany = () => {
  const { companyId } = useParams()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/company/${companyId}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.log(message)
        return
      }
      const json = await response.json()

      console.log(json)
      
      json.games = json.published && json.developed ? json.developed.concat(json.published) : (json.published || json.developed || [])
      delete json.published
      delete json.developed
      
      setResults(json)
      setLoading(false)
    }
    gameSearch()
  }, [companyId])

  return(
    <div>
      {loading ? "Loading..." : (
        <>
          <div className="flex flex-col mx-52 pb-4 text-white border-b border-white/50">
            <p className="text-sm font-light text-white/50">Company</p>
            <p className="text-3xl mb-2 font-semibold">{results.name}</p>
            <p className="font-light text-white/75">{results.description}</p>
          </div>
          <GameDisplay defaultSort={1} additionalFilter={`involved_companies.company = ${companyId}`} />
        </>
      )}
    </div>
  )
}

export default GamesByCompany