import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { GameDisplay } from "../components"

const GamesByCompany = () => {
  const { companyId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])

  const year = parseInt(searchParams.get('year') || '0')
  const currentGenre = parseInt(searchParams.get('genre') || '0')
  const currentPlatform = parseInt(searchParams.get('platform') || '0')
  const sortBy = searchParams.get('sortBy') || "release_date"
  const sortOrder = parseInt(searchParams.get('sortOrder') || '-1')
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    async function gameSearch() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/company/${companyId}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        alert(message)
        return
      }
      const json = await response.json()
      console.log(json)
      setResults(json)
      setLoading(false)
    }
    gameSearch()
  }, [companyId])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return(
    <div>
      <div className="flex flex-col mx-52 pb-4 text-white border-b border-white/50">
        <p className="text-sm font-light text-white/50">Company</p>
        <p className="text-3xl mb-2 font-semibold">{results.name}</p>
        <p className="font-light text-white/75">{results.description != "N/A" ? results.description : ""}</p>
      </div>
      <GameDisplay count={results.results[0].count[0].count} results={results.results[0].games} />
    </div>
  )
}

export default GamesByCompany