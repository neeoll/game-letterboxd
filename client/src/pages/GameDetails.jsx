import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"
import { completionStatuses, platforms, genres } from "../dict"
import { GameCard, ReviewDialog } from "../components"
import { gameDetailsTimestamp, getYearFromTimestamp } from "../utils"
import { calculateRatingDistribution } from "../utils"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

const GameDetails = () => {
  const { gameId } = useParams()

  const headers = {
    'view-token': localStorage.getItem(`${gameId}-view-token`)
  }

  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [ratingDistributions, setRatingDistributions]  = useState([])

  useEffect(() => {
    async function getDetails() {
      setLoading(true)
      
      if (localStorage.getItem('jwt-token')) {
        headers['user-token'] = localStorage.getItem('jwt-token')
      }

      const response = await fetch(`http://127.0.0.1:5050/game/${gameId}`, {
        headers: headers
      })
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()
      
      if (json.token) localStorage.setItem(`${gameId}-view-token`, json.token)
      
      setDetails(json.data)
      setRatingDistributions(calculateRatingDistribution(json.data.reviews))
      setLoading(false)
    }
    getDetails()

    return
  }, [gameId])

  async function addGame(payload) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game/addGame`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'authorization': localStorage.getItem('jwt-token'),
        'content-type': 'application/json'
      }
    })
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return ( 
    <div className="flex flex-col mt-10 px-40 pb-8">
      {/* Header Portion */}
      <div className="flex items-end w-full">
        <div className="flex w-1/5 justify-center">
          <img className="max-w-40 rounded z-10" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${details.coverId}.jpg`} />
        </div>
        <div className="flex flex-col w-4/5 gap-1">
          <h1 className="text-5xl font-semibold text-indigo-100">{details.name}</h1>
          <div className="flex gap-2 text-xl text-indigo-100/50">
            <p>Released on</p> 
            <Link to={{ pathname: "/games", search: `?year=${getYearFromTimestamp(details.releaseDate)}`}} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{gameDetailsTimestamp(details.releaseDate)}</Link>
            {details.companies.length != 0 ? (
              <>
                <p>by</p> 
                <Link to={`/games/company/${details.companies[0].companyId}`} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{details.companies[0].name}</Link>
              </>
            ): <></>}
          </div>
        </div>
      </div>
      <div className="flex w-full">
        {/* Review and Score Content */}
        <div className="flex flex-col w-1/5 p-4 gap-2">
          <div className="relative flex flex-col gap-1">
            <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-[#ff9900] to-[#ff00ff] opacity-75 blur-sm ${localStorage.getItem('jwt-token') ? "-mt-12" : ""}`} />
            {localStorage.getItem('jwt-token') != null ? (
              <div className="relative -mt-12">
                <div className="flex flex-col items-center rounded p-2 gap-2 pt-12 bg-neutral-800">
                  <ReviewDialog gameId={details.gameId} name={details.name} cover={details.coverId} platforms={details.platforms.map(item => platforms.find(platform => platform.id == item))} />
                  <StyledRating defaultValue={details.userReview?.rating || 0} size="large" readOnly />
                  <div className="flex gap-2">
                    <button onClick={() => addGame({ status: "played", id: details.gameId })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                      <IoLogoGameControllerB size={"1.25em"}/>
                      <p>Played</p>
                    </button>
                    <button onClick={() => addGame({ status: "playing", id: details.gameId })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                      <IoIosPlay size={"1.25em"}/>
                      <p>Playing</p>
                    </button>
                    <button onClick={() => addGame({ status: "backlog", id: details.gameId })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                      <IoIosBookmarks size={"1.25em"}/>
                      <p>Backlog</p>
                    </button>
                    <button onClick={() => addGame({ status: "wishlist", id: details.gameId })} className="flex flex-col gap-1 text-xs text-indigo-50/75 hover:text-amber-300 justify-center items-center">
                      <IoIosGift size={"1.25em"}/>
                      <p>Wishlist</p>
                    </button>
                  </div>
                </div>
              </div> 
              ) : (
              <></>
            )}
            <div className="relative flex flex-col gap-2 text-indigo-50 items-center bg-neutral-800 rounded p-2">
              <p className="font-semibold text-md text-white/50">Avg. Rating</p> 
              <p className="font-bold text-3xl">{(details.avgRating || 0).toFixed(1)}</p>
              <div className="flex flex-wrap w-full text-indigo-50/25 justify-center items-center text-center">
                <div className="w-full flex h-24 gap-1">
                  {ratingDistributions.map(rating => (
                    <div className="flex flex-col w-1/5 justify-end">
                      <div className={`bg-amber-400 rounded-t`} style={{ height: `calc(${rating.percent}% + ${rating.percent + 10}px)`}} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-full font-light text-indigo-50/75">
                <div className="flex w-full px-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <IoLogoGameControllerB size={"1.25em"}/>
                    <p>Played</p>
                  </div>
                  <div>{details.played.length}</div>
                </div>
                <div className="flex w-full px-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <IoIosPlay size={"1.25em"}/>
                    <p>Playing</p>
                  </div>
                  <div>{details.playing.length}</div>
                </div>
                <div className="flex w-full px-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <IoIosBookmarks size={"1.25em"}/>
                    <p>Backlogs</p>
                  </div>
                  <div>{details.backlog.length}</div>
                </div>
                <div className="flex w-full px-2 justify-between">
                  <div className="flex gap-1 items-center">
                    <IoIosGift size={"1.25em"}/>
                    <p>Wishlist</p>
                  </div>
                  <div>{details.wishlist.length}</div>
                </div>
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
                  {/* Summary */}
                  <div className="flex flex-col pb-[2px] text-indigo-50 bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
                    <div className="bg-neutral-900 pb-2">
                      <p className="text-indigo-100/75">{details.summary}</p>
                    </div>
                  </div>
                  {/* Series */}
                  {details.collection.length != 0 ?
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <p className="font-semibold text-indigo-100">Other Games in Series</p>
                        <Link to={`/games/series/${details.collections[0]}`} className="text-sm font-semibold text-indigo-300 hover:underline">See more</Link>
                      </div>
                      <div className="flex w-full h-fit flex-wrap gap-4 justify-center">
                        {details.collection.map(game => (
                          <GameCard size={"h-36"} game={game} />
                        ))}
                      </div>
                    </div> : <></>
                  }
                </div>
              </div>
            </div>
            {/* Platforms and Genres*/}
            <div className="flex flex-col w-1/4 gap-4 text-indigo-50 p-1">
              {/* Platforms */}
              <div className="flex flex-col gap-2">
                <p className="font-bold">Playable on:</p>
                <div className="flex w-full flex-wrap gap-2">
                  {details.platforms.map(platform => 
                    <div className="relative group hover:text-white">
                      <div className="absolute -inset-0.5 rounded group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
                      <div key={platform} className="relative flex gap-1 items-center text-sm bg-neutral-800 rounded p-1 px-2">
                        <IoLogoGameControllerB />
                        <Link to={{ pathname: "/games", search: `?platform=${platform}`}}>{platforms.find(plat => plat.id == platform).name}</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Genres */}
              <div className="flex flex-col gap-2">
                <p className="font-bold">Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {details.genres.map(genre =>
                    <div className="relative group hover:text-white">
                    <div className="absolute -inset-0.5 rounded group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
                    <div key={genre} className="relative flex gap-1 items-center text-sm bg-neutral-800 rounded p-1 px-2">
                      <Link to={{ pathname: "/games", search: `?genre=${genre}`}}>{genres.find(gen => gen.id == genre).name}</Link>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* TODO: Implement MongoDB instance to push and pull reviews */}
          <div className="flex flex-col gap-y-4 p-4">
            {details.reviews.map((review, index) => (
              <div key={index} className="flex text-indigo-50 gap-x-2 p-4 border-b">
                <div className="flex flex-col justify-start">
                  {/* Profile picture goes here */}
                  <div className="w-10 h-10 rounded bg-gray-500" />
                </div>
                <div className="flex flex-col justify-start">
                  <div>{review.user.username}</div>
                  <div className="flex gap-2 items-center">
                    <StyledRating readOnly value={review.rating} size="small" />
                    <div className="flex gap-1 text-white">
                      {completionStatuses.find(status => status.value == review.status).element()}
                      <p className="text-white/50">on</p> 
                      <Link to={{ pathname: "/games", search: `?platform=${review.platform}`}} className="text-white">{platforms.find(platform => platform.id == review.platform).name}</Link>
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