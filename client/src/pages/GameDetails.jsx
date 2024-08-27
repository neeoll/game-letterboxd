import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import { gameActions, platforms, genres } from "../dict"
import { GameCard, GameReview, ReviewDialog, StyledRating } from "../components"
import { gameDetailsTimestamp, getYearFromTimestamp } from "../utils"
import { calculateRatingDistribution } from "../utils"
import axios from 'axios'

const GameDetails = ({ isAuthenticated }) => {
  const { gameId } = useParams()

  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState()
  
  useEffect(() => {
    async function getDetails() {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/${gameId}`, { withCredentials: isAuthenticated })
      .then(res => {
        setDetails(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
    }
    getDetails()
    return
  }, [gameId])

  async function addGame(status, id) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/addGame`, { status, id }, { withCredentials: true })
  }

  if (loading) {
    return (
      <div></div>
    )
  }

  return ( 
    <div className="mt-10 pb-8 text-white">
      {/* Background Image */}
      <div className="absolute -z-20 inset-0 bg-neutral-700">
        {details.artworks.length != 0 ?
          <img className="size-full object-cover" src={`https://images.igdb.com/igdb/image/upload/t_1080p/${details.artworks[Math.floor(Math.random() * (details.artworks.length - 1))]}.jpg`}/> :
          <></>
        }
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-neutral-900 via-50% to-neutral-900 to-60%"></div>
      </div>
      {/* Page Content */}
      <div className="grid grid-cols-5 grid-rows-4 auto-cols-max auto-rows-max">
        {/* Cover */}
        <div className="row-span-1 col-span-1 flex flex-col items-center justify-end">
          <img className="w-40 aspect-[45/64] rounded z-10" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${details.coverId}.jpg`} />
        </div>
        {/* Title */}
        <div className="row-span-1 col-span-4 flex flex-col gap-2 px-2 justify-end">
          <h1 className="text-5xl font-semibold">{details.name}</h1>
          <div className="flex gap-2 text-xl text-white/50">
            <p>{details.releaseDate > Date.now() / 1000 ? "Releases" : "Released"} on</p> 
            <Link to={{ pathname: "/games", search: `?year=${getYearFromTimestamp(details.releaseDate)}`}} className="text-white/75 font-semibold hover:text-white">{gameDetailsTimestamp(details.releaseDate)}</Link>
            {details.company ? (
              <>
                <p>by</p> 
                <Link to={`/games/company/${details.company.companyId}`} className="text-white/75 font-semibold hover:text-white">{details.company.name}</Link>
              </>
            ): <></>}
          </div>
        </div>
        {/* Review Dialog and Score Content */}
        <div className="row-span-2 col-span-1 flex flex-col p-4 gap-2">
          <div className="relative flex flex-col gap-1">
            <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm ${isAuthenticated ? "-mt-12" : ""}`} />
            {isAuthenticated ? (
              <div className="relative -mt-12">
                <div className="flex flex-col items-center rounded p-2 gap-2 pt-12 bg-neutral-800">
                  <ReviewDialog gameId={details.gameId} name={details.name} cover={details.coverId} platforms={details.platforms.map(item => platforms.find(platform => platform.id == item))} />
                  <StyledRating defaultValue={details.userReview?.rating || 0} size="large" readOnly />
                  <div className="flex gap-2">
                    {gameActions.map(action => (
                      <button onClick={() => addGame(action.status, details.gameId)} className="flex flex-col gap-1 text-xs text-white/75 hover:text-white items-center">
                        {action.icon()}
                        <p>{action.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div> 
              ) : (
              <></>
            )}
            <div className="relative flex flex-col gap-2 text-white items-center bg-neutral-800 rounded p-2">
              <p className="font-semibold text-md text-white/50">Avg. Rating</p> 
              <p className="font-bold text-3xl">{(details.avgRating || 0).toFixed(1)}</p>
              <div className="flex flex-wrap w-full text-white/25 justify-center items-center text-center">
                <div className="w-full flex h-24 gap-1">
                  {calculateRatingDistribution(details.reviews).map(rating => (
                    <div key={rating.value} className="flex flex-col w-1/5 justify-end">
                      <div className={`bg-amber-400 rounded-t`} style={{ height: `calc(${rating.percent}% + ${rating.percent + 10}px)`}} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-full font-light text-white/75">
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
        {/* Summary and Series */}
        <div className="row-span-2 col-span-3">
          <div className="flex flex-col gap-2 p-2">
            <p className="text-white/75">{details.summary}</p>
            <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
          </div>
          {details.collection.length != 0 ?
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2">
                <p className="font-semibold">Other Games in Series</p>
                <Link to={`/games/series/${details.collections[0]}`} className="text-sm font-semibold hover:underline">See more</Link>
              </div>
              <div className="flex h-fit gap-2 px-2 justify-start flex-wrap">
                {details.collection.map(game => (
                  <GameCard key={game.gameId} size={"h-32"} game={game} />
                ))}
              </div>
            </div> : <></>
          }
        </div>
        {/* Platforms and Genres */}
        <div className="row-span-2 col-span-1 flex flex-col gap-4 px-1">
          {/* Platforms */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">Playable on:</p>
            <div className="flex w-full flex-wrap gap-2">
              {details.platforms.map(platform => 
                <div key={platform} className="relative group">
                  <div className="absolute -inset-0.5 rounded blur-sm group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary" />
                  <Link to={{ pathname: "/games", search: `?platform=${platform}`}} className="relative text-sm bg-neutral-800 rounded p-1 px-2">
                    {platforms.find(plat => plat.id == platform).name}
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Genres */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">Genres:</p>
            <div className="flex flex-wrap gap-2">
              {details.genres.map(genre =>
                <div key={genre} className="relative group">
                  <div className="absolute -inset-0.5 rounded blur-sm group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary" />
                  <Link to={{ pathname: "/games", search: `?genre=${genre}`}} className="relative text-sm bg-neutral-800 rounded p-1 px-2">
                    {genres.find(gen => gen.id == genre).name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row-span-3 col-span-1" />
        {/* Reviews */}
        <div className="row-span-3 col-span-3">
          <div className="flex flex-col gap-4">
            {details.reviews.map((review, index) => (
              <GameReview key={index} review={review} />
            ))}
          </div>
        </div>
        <div className="row-span-3 col-span-1" />
      </div>
    </div>
  )
}

export default GameDetails