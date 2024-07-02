import { useEffect, useState } from "react"

const Test = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    async function getData() {
      const response = await fetch('http://127.0.0.1:5050/record/')
      const data = await response.json()
      setData(data)
    }

    getData()
    return
  }, [])

  return (
    <div className="flex flex-col">
      {data.map(entry => (
        <div>{entry.name}</div>
      ))}
    </div>
  )
}

export default Test