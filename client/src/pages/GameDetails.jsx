import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import moment from "moment"
import { reviews } from "../temp/reviewPlaceholder"
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"

const completionStatuses = [
  {
    id: 1,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <div>Completed</div>
      </div>
    ),
    value: "completed"
  },
  {
    id: 2,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-sky-500" />
        <div>Played</div>
      </div>
    ),
    value: "played"
  },
  {
    id: 3,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div>Shelved</div>
      </div>
    ),
    value: "shelved"
  },
  {
    id: 4,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div>Abandoned</div>
      </div>
    ),
    value: "abandoned"
  },
]

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
});

const GameDetails = () => {
  const { gameId } = useParams()

  const [details, setDetails] = useState({})
  const [randomImg, setRandomImg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/${gameId}?title=zelda`)
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      json.collection = json.collections ? json.collections[0].games.filter(game => game.id != gameId) : null
      json.collection ? json.collection.length = 6 : console.log("No collection")

      json.images = json.artworks && json.screenshots ? json.screenshots.concat(json.artworks) : (json.artworks || json.screenshots || [])
      json.artworks ? delete json.artworks : console.log("No artworks")
      json.screenshots ? delete json.screenshots : console.log("No screenshots")

      console.log(json)

      let randomIndex = Math.floor((Math.random() * json.images.length))
      console.log(`https://images.igdb.com/igdb/image/upload/t_screenshot_big_2x/${json.images[randomIndex].image_id}.jpg`)

      setRandomImg(`https://images.igdb.com/igdb/image/upload/t_screenshot_big_2x/${json.images[randomIndex].image_id}.jpg`)
      setDetails(json)
      setLoading(false)
    }
    getDetails()

    return
  }, [gameId])

  return (
    <>
      {!loading ? 
        <>
          {/* Background Image */}
          <div className="flex w-full h-screen justify-center relative z-0">
            <img className="sticky h-screen w-screen" src={randomImg} />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 from-35%"/>
          </div>
          {/* Page Content */}
          <div className="absolute overflow-hidden inset-0 z-1">
            <SimpleBar autoHide={true} style={{ maxHeight: "100%"}}>
              <Navbar />
              <div className="flex flex-col mt-10 px-40 pb-8 bg-gradient-to-t from-neutral-950 from-75%">
                {/* Header Portion */}
                <div className="flex items-end w-full">
                  <div className="flex w-1/5 justify-center">
                    <img className="max-w-40 rounded border border-black" src={details.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${details.cover.image_id}.jpg` : ''} />
                  </div>
                  <div className="flex flex-col w-4/5 gap-1">
                    <h1 className="text-5xl font-semibold text-indigo-100">{details.name}</h1>
                    <p className="text-xl text-indigo-100/50">Released on <Link to={{ pathname: "/games", search: `?year=${moment.unix(details.first_release_date).year()}`}} className="text-indigo-100/75 font-semibold hover:text-white">{moment.unix(details.first_release_date).format("MMM D, YYYY")}</Link> by <Link to={`/games/company/${details.involved_companies[0].company.id}`} className="text-indigo-100/75 font-semibold hover:text-white">{details.involved_companies[0].company.name}</Link></p>
                  </div>
                </div>
                <div className="flex w-full">
                  {/* TODO: Game Score and Review Details */}
                  <div className="flex flex-col w-1/5 p-4">
                    <div className="flex flex-col gap-2 text-white items-center bg-neutral-700 rounded p-2">
                      <p className="font-semibold text-md text-white/50">Avg. Rating</p> 
                      <p className="font-bold text-3xl">{((details.total_rating / 100) * 5).toFixed(1)}</p>
                      <div className="flex flex-wrap text-white/25 border-b rounded p-2 justify-center items-center text-center">
                        TODO: Rating Distribution Chart
                      </div>
                      <div className="flex flex-col w-full font-light text-white/75">
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
                            {details.collection != null ?
                              <div className="flex flex-col">
                                <div className="flex justify-between">
                                  <p className="font-semibold text-indigo-100">Other Games in Series</p>
                                  <Link to={`/games/series/${details.collections[0].id}`} className="text-sm font-semibold text-indigo-300 hover:underline">See more</Link>
                                </div>
                                <div className="flex w-full h-fit flex-wrap gap-2 justify-start">
                                  {details.collection.map(game => (
                                    <Link to={`/game/${game.id}`} className="relative h-36 group text-white font-semibold">
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
                      <div className="flex flex-col w-1/4 gap-1 text-white p-1">
                        <p className="font-bold">Playable on</p>
                        <div className="flex w-full flex-wrap gap-2">
                          {details.platforms.map(platform => 
                            <div className="flex gap-1 items-center text-sm border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                              <IoLogoGameControllerB />
                              <Link to={{ pathname: "/games", search: `?platform=${platform.id}`}}>{platform.name.length > 20 ? platform.abbreviation || platform.name : platform.name}</Link>
                            </div>
                          )}
                        </div>
                        <p className="font-bold">Genres</p>
                        <div className="flex flex-wrap gap-2">
                          {details.genres.map(genre => 
                            <div className="w-fit text-xs border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                              <Link to={{ pathname: "/games", search: `?genre=${genre.id}`}}>{genre.name}</Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* TODO: Implement MongoDB instance to push and pull reviews */}
                    <div className="flex flex-col gap-y-4 p-4">
                      {reviews.map(review => (
                        <div key={review.id} className="flex text-white gap-x-2 p-4 border-b">
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
                              <div className="flex gap-1 text-white">
                                {completionStatuses[Math.floor(Math.random() * 4)].element()}
                                <p className="text-white/50">on <Link to={{ pathname: "/games", search: `?platform=${details.platforms[0].id}`}} className="text-white">{details.platforms[0].name}</Link></p>
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
            </SimpleBar>
          </div>
        </> : 
        "Loading..."
      }
    </>
  )
}

export default GameDetails