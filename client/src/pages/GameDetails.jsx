import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import { platforms, genres } from "../dict"
import { GameCard, GameReview, ReviewDialog, StyledRating } from "../components"
import { gameDetailsTimestamp, getYearFromTimestamp } from "../utils"
import { calculateRatingDistribution } from "../utils"
import axios from 'axios'

const GameDetails = () => {
  const { gameId } = useParams()

  const [details, setDetails] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/${gameId}`, { 
        headers: { 'user-token': localStorage.getItem('jwt-token') }
      })
      .then(res => {
        setDetails(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
    }
    getDetails()

    return
  }, [gameId])

  async function addGame(payload) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/addGame`, payload, {
      headers: {
        'authorization': localStorage.getItem('jwt-token')
      }
    })
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return ( 
    <div className="flex flex-col mt-10 pb-8">
      {/* Header Portion */}
      <div className="flex items-end w-full">
        <div className="flex w-1/5 justify-center">
          <img className="max-w-40 rounded z-10" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${details.coverId}.jpg`} />
        </div>
        <div className="flex flex-col w-4/5 gap-1">
          <h1 className="text-5xl font-semibold text-indigo-100">{details.name}</h1>
          <div className="flex gap-2 text-xl text-indigo-100/50">
            <p>{details.releaseDate > Date.now() / 1000 ? "Releases" : "Released"} on</p> 
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
      {/* Background Image */}
      <div className="absolute -z-20 inset-0 w-screen h-screen bg-neutral-700">
        <img className="w-full h-full object-cover object-center" src={`https://images.igdb.com/igdb/image/upload/t_1080p/${details.artworks[Math.floor(Math.random() * (details.artworks.length - 1))]}.jpg`}/>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent from-10% via-neutral-900 via-50% to-neutral-900 to-60%"></div>
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
                  {calculateRatingDistribution(details.reviews).map(rating => (
                    <div key={rating.value} className="flex flex-col w-1/5 justify-end">
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
                  <div className="flex flex-col gap-2">
                    <p className="text-indigo-100/75">{details.summary}</p>
                    <div className="h-0.5 bg-gradient-to-r from-[#ff9900] to-[#ff00ff]" />
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
                          <GameCard key={game.gameId} size={"h-32"} game={game} />
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
                    <div key={platform} className="relative group hover:text-white">
                      <div className="absolute -inset-0.5 rounded group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
                      <div className="relative flex gap-1 items-center text-sm bg-neutral-800 rounded p-1 px-2">
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
                    <div key={genre} className="relative group hover:text-white">
                      <div className="absolute -inset-0.5 rounded group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
                      <div className="relative flex gap-1 items-center text-sm bg-neutral-800 rounded p-1 px-2">
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
              <GameReview key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetails