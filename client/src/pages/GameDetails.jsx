import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import moment from "moment"
import { reviews } from "../temp/reviewPlaceholder"
import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"
import { completion_statuses } from "../dict"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

const GameDetails = () => {
  const { game_id } = useParams()

  const [details, setDetails] = useState({})
  const [randomImg, setRandomImg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/${game_id}`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      json.collection = json.collections ? json.collections[0].games.filter(game => game.id != game_id) : null
      console.log(json.collection)
      json.collection ? json.collection.length = 6 : console.log("No collection")

      json.images = json.artworks && json.screenshots ? json.screenshots.concat(json.artworks) : (json.artworks || json.screenshots || [])
      json.artworks ? delete json.artworks : console.log("No artworks")
      json.screenshots ? delete json.screenshots : console.log("No screenshots")

      let randomIndex = Math.floor((Math.random() * json.images.length))
      // if (json.images.length != 0) setRandomImg(`https://images.igdb.com/igdb/image/upload/t_screenshot_big_2x/${json.images[randomIndex].image_id}.jpg`)
      console.log(json)
      setDetails(json)
      setLoading(false)
    }
    getDetails()

    return
  }, [game_id])

  async function addGame(payload) {
    const response = await fetch('http://127.0.0.1:5050/game/addGame', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'authorization': localStorage.getItem('jwt-token'),
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return ( 
    <div className="flex flex-col mt-10 px-40 pb-8 bg-gradient-to-t from-indigo-900 from-75%">
      {/* Header Portion */}
      <div className="flex items-end w-full">
        <div className="flex w-1/5 justify-center">
          <img className="max-w-40 rounded border border-black z-10" src={details.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${details.cover.image_id}.jpg` : ''} />
        </div>
        <div className="flex flex-col w-4/5 gap-1">
          <h1 className="text-5xl font-semibold text-indigo-100">{details.name}</h1>
          <div className="flex gap-2 text-xl text-indigo-100/50">
            <p>Released on</p> 
            <Link to={{ pathname: "/games", search: `?year=${moment.unix(details.first_release_date).year()}`}} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{moment.unix(details.first_release_date).format("MMM D, YYYY")}</Link>
            {details.involved_companies ? (
              <>
                <p>by</p> 
                <Link to={`/games/company/${details.involved_companies[0].company.id}`} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{details.involved_companies[0].company.name}</Link>
              </>
            ): <></>}
          </div>
        </div>
      </div>
      <div className="flex w-full">
        {/* TODO: Game Score and Review Details */}
        <div className="flex flex-col w-1/5 p-4 gap-2">
          {localStorage.getItem('jwt-token') != null ? (
            <div className="flex flex-col gap-2 items-center bg-indigo-800 rounded p-2 pt-12 -mt-12">
              <button className="w-full bg-red-500 rounded text-indigo-50 p-1">Log or Review</button>
              <div className="flex justify-center p-1 w-full border-b">
                <StyledRating precision={0.5} size="large"/>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addGame({ status: "played", id: details.id })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                  <IoLogoGameControllerB size={"1.25em"}/>
                  <p>Played</p>
                </button>
                <button onClick={() => addGame({ status: "playing", id: details.id })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                  <IoIosPlay size={"1.25em"}/>
                  <p>Playing</p>
                </button>
                <button onClick={() => addGame({ status: "backlog", id: details.id })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                  <IoIosBookmarks size={"1.25em"}/>
                  <p>Backlog</p>
                </button>
                <button onClick={() => addGame({ status: "wishlist", id: details.id })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                  <IoIosGift size={"1.25em"}/>
                  <p>Wishlist</p>
                </button>
              </div>
            </div> ) : (<></>)
          }
          <div className="flex flex-col gap-2 text-indigo-50 items-center bg-indigo-800 rounded p-2">
            <p className="font-semibold text-md text-indigo-50/50">Avg. Rating</p> 
            <p className="font-bold text-3xl">{((details.total_rating / 100) * 5).toFixed(1)}</p>
            <div className="flex flex-wrap text-indigo-50/25 border-b rounded p-2 justify-center items-center text-center">
              TODO: Rating Distribution Chart
            </div>
            <div className="flex flex-col w-full font-light text-indigo-50/75">
              <div className="flex w-full px-2 justify-between">
                <div className="flex gap-1 items-center">
                  <IoLogoGameControllerB size={"1.25em"}/>
                  <p>Plays</p>
                </div>
                <div>{(Math.random() * 100).toFixed(1)}K</div>
              </div>
              <div className="flex w-full px-2 justify-between">
                <div className="flex gap-1 items-center">
                  <IoIosPlay size={"1.25em"}/>
                  <p>Playing</p>
                </div>
                <div>{(Math.random() * 100).toFixed(1)}K</div>
              </div>
              <div className="flex w-full px-2 justify-between">
                <div className="flex gap-1 items-center">
                  <IoIosBookmarks size={"1.25em"}/>
                  <p>Backlogs</p>
                </div>
                <div>{(Math.random() * 100).toFixed(1)}K</div>
              </div>
              <div className="flex w-full px-2 justify-between">
                <div className="flex gap-1 items-center">
                  <IoIosGift size={"1.25em"}/>
                  <p>Wishlist</p>
                </div>
                <div>{(Math.random() * 100).toFixed(1)}K</div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex flex-col w-4/5">
          <div className="flex">
            <div className="w-3/4">
              <div className="flex flex-col h-fit p-2 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-indigo-100/75 border-b border-indigo-100/75 pb-2">{details.summary}</p>
                  {/* Series */}
                  {details.collections != null ?
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <p className="font-semibold text-indigo-100">Other Games in Series</p>
                        <Link to={`/games/series/${details.collections[0].id}`} className="text-sm font-semibold text-indigo-300 hover:underline">See more</Link>
                      </div>
                      <div className="flex w-full h-fit flex-wrap gap-2 justify-start">
                        {details.collection.map(game => (
                          <Link key={game.id} to={`/game/${game.id}`} className="relative h-36 group text-indigo-50 font-semibold">
                            <img className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg` : ""} />
                            <p className="flex absolute inset-0 p-0.5 items-center justify-center text-center w-full h-full invisible group-hover:visible">{game.name}</p>
                          </Link>
                        ))}
                      </div>
                    </div> : <></>
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/4 gap-1 text-indigo-50 p-1">
              <p className="font-bold">Playable on</p>
              <div className="flex w-full flex-wrap gap-2">
                {details.platforms.map(platform => 
                  <div key={platform.id} className="flex gap-1 items-center text-sm border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                    <IoLogoGameControllerB />
                    <Link to={{ pathname: "/games", search: `?platform=${platform.id}`}}>{platform.name.length > 20 ? platform.abbreviation || platform.name : platform.name}</Link>
                  </div>
                )}
              </div>
              <p className="font-bold">Genres</p>
              <div className="flex flex-wrap gap-2">
                {details.genres.map(genre => 
                  <div key={genre.id} className="w-fit text-xs border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                    <Link to={{ pathname: "/games", search: `?genre=${genre.id}`}}>{genre.name}</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* TODO: Implement MongoDB instance to push and pull reviews */}
          <div className="flex flex-col gap-y-4 p-4">
            {reviews.map(review => (
              <div key={review.id} className="flex text-indigo-50 gap-x-2 p-4 border-b">
                <div className="flex flex-col justify-start">
                  {/* Profile picture goes here */}
                  <div className="w-10 h-10 rounded bg-gray-500" />
                </div>
                <div className="flex flex-col justify-start">
                  <div>{review.email}</div>
                  <div className="flex gap-2 items-center">
                    <StyledRating 
                      readOnly
                      precision={0.5} 
                      value={Math.floor(Math.random() * 11) / 2}
                      size="small"
                    />
                    <div className="flex gap-1 text-indigo-50">
                      {completion_statuses[Math.floor(Math.random() * 4)].element()}
                      <p className="text-indigo-50/50">on <Link to={{ pathname: "/games", search: `?platform=${details.platforms[0].id}`}} className="text-indigo-50">{details.platforms[0].name}</Link></p>
                    </div>
                  </div>
                  <div>{review.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails