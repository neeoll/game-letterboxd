import { useSearchParams } from "react-router-dom"
import { GameDisplay } from "../components"
import { useEffect, useState } from "react"

const GameSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
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
      const response = await fetch(`http://127.0.0.1:5050/game?genre=${currentGenre}&platform=${currentPlatform}&year=${year}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        alert(message)
        return
      }
      const json = await response.json()
      setCount(json.count[0].count)
      setResults(json.results)
      setLoading(false)
    }
    gameSearch()
  }, [location.search])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return(
    <GameDisplay count={count} results={results} />
  )
}

export default GameSearch