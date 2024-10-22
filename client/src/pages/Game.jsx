import { useEffect, useState } from "react"
import { useParams, Link, useOutletContext } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import { RxStar, RxStarFilled } from "react-icons/rx"
import { platforms, genres } from "../dict"
import { GameCard, GameReview, ReviewDialog, StyledRating } from "../components"
import { calculateRatingDistribution, useAsyncError, timestamps } from "../utils"
import { gameAPI } from "../api"

const Game = () => {
  const { slug } = useParams()
  const context = useOutletContext()
  const throwError = useAsyncError()

  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState()
  
  useEffect(() => {
    context.scrollRef.current.scrollTo(0, 0)
    gameAPI.get(slug)
    .then(response => {
      document.title = response.data.name
      setDetails(response.data)
      setLoading(false)
    })
    .catch(error => throwError(error))
  }, [slug])

  async function toggleFavorite(slug) {
    setDetails({ ...details, favorite: !details.favorite })
    gameAPI.favorite(slug)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-5 grid-auto-rows gap-x-2 animate-[pulse_1s_linear_infinite]">
        {/* Cover */}
        <div className="col-span-1 flex items-end justify-center">
          <div className="basis-3/4">
            <div className="size-full aspect-[45/64] placeholder" />
          </div>
        </div>
        {/* Title */}
        <div className="col-span-4 flex flex-col gap-2 px-2 justify-end">
          <div className="h-12 w-[75%] placeholder" />
          <div className="h-8 w-[50%] placeholder" />
        </div>
        {/* Review Dialog and Score Content */}
        <div className="col-span-1 flex flex-col p-4 gap-2">
          <div className="relative flex flex-col gap-1">
            <div className="h-36 placeholder" />
            <div className="h-72 placeholder" />
          </div>
        </div>
        {/* Summary and Series */}
        <div className="col-span-3 h-fit">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col gap-1.5">
              {Array.apply(null, Array(Math.floor(Math.random() * 3) + 3)).map((_, index) => (
                <div key={index} className={`h-6 placeholder`} style={{ width: `${Math.floor(Math.random() * 21) + 80}%`}} />
              ))}
            </div>
            <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between px-2">
              <div className="h-6 w-44 placeholder" />
              <div className="h-6 w-16 placeholder" />
            </div>
            <div className="flex h-fit justify-start flex-wrap">
              {Array.apply(null, Array(6)).map((_, index) => (
                <div key={index} className="basis-[16.66%] p-1">
                  <div className="aspect-[45/64] placeholder"/>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Platforms and Genres */}
        <div className="col-span-1 flex flex-col gap-4 px-1">
          {/* Platforms */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-24 placeholder" />
            <div className="flex w-full flex-wrap gap-2">
              {Array.apply(null, Array(Math.floor(Math.random() * 3) + 3)).map((_, index) => (
                <div key={index} className="h-6 w-20 placeholder" style={{ width: `${Math.floor(Math.random() * 20) + 30}%`}}>
                </div>
              ))}
            </div>
          </div>
          {/* Genres */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-24 placeholder" />
            <div className="flex w-full flex-wrap gap-2">
              {Array.apply(null, Array(Math.floor(Math.random() * 3) + 3)).map((_, index) => (
                <div key={index} className="h-6 w-20 placeholder" style={{ width: `${Math.floor(Math.random() * 20) + 30}%`}}>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-1" />
        {/* Reviews */}
        <div className="col-span-3">
          <div className="flex flex-col gap-2">
            {Array.apply(null, Array(Math.floor(Math.random() * 3) + 3)).map((_, index) => (
              <div key={index} className="flex flex-col py-4 gap-2">
                <div className="flex gap-2">
                  <div className="size-10 placeholder-lg" />
                  <div className="flex flex-col w-full gap-1">
                    <div className="h-6 w-24 placeholder" />
                    <div className="flex gap-2 items-center">
                      <div className="h-6 w-28 placeholder"/>
                      <div className="h-6 w-48 placeholder" />
                    </div>
                    {Array.apply(null, Array(Math.floor(Math.random() * 3) + 1)).map((_, index) => (
                      <div key={index} className={`h-6 placeholder`} style={{ width: `${Math.floor(Math.random() * 21) + 80}%`}} />
                    ))}
                  </div>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1" />
      </div>
    )
  }

  return ( 
    <div className="pb-8 text-white">
      {/* Background Image */}
      <div className="absolute -z-20 inset-0 bg-neutral-700">
        {details.images.length != 0 ?
          <img className="size-full object-cover" src={`https://images.igdb.com/igdb/image/upload/t_1080p_2x/${details.images[Math.floor(Math.random() * (details.images.length - 1))]}.jpg`}/> :
          <></>
        }
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-neutral-900 via-50% to-neutral-900 to-60%"></div>
      </div>
      {/* Page Content */}
      <div className="grid grid-cols-5 grid-auto-rows gap-x-2">
        {/* Cover */}
        <div className="col-span-1 flex items-end justify-center">
          <div className="relative basis-3/4">
            <img className="size-full aspect-[45/64] rounded z-10" src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${details.coverId}.jpg`} />
            <div className="absolute top-1.5 end-1.5">
              <button onClick={() => toggleFavorite(details.slug)}className="group text-3xl">
                {details.favorite ? <RxStarFilled className="text-yellow-500 group-active:text-white"/> : <RxStar className="group-active:text-yellow-500"/>}       
              </button>
            </div>
          </div>
        </div>
        {/* Title */}
        <div className="col-span-4 flex flex-col gap-2 px-2 justify-end">
          <h1 className="text-5xl font-semibold">{details.name}</h1>
          <div className="flex gap-2 text-xl text-white/50">
            <p>{details.releaseDate > Date.now() / 1000 ? "Releases" : "Released"} on</p> 
            <Link to={{ pathname: "/games", search: `?year=${timestamps.year(details.releaseDate)}`}} className="text-white/75 font-semibold hover:text-white">{timestamps.verbose(details.releaseDate)}</Link>
            {details.companies.length != 0 ? (
              <>
                <p>by</p>
                {details.companies.slice(-2).map((company, index) => (
                  <Link key={index} to={`/company/${company.slug}`} className="text-white/75 font-semibold hover:text-white">{company.name}{index != details.companies.slice(-2).length - 1 ? ", " : ""}</Link>
                ))} 
              </>
            ): <></>}
          </div>
        </div>
        {/* Review Dialog and Score Content */}
        <div className="col-span-1 flex flex-col p-4 gap-2">
          <div className="relative flex flex-col gap-1">
            <div className={`absolute -inset-1 rounded-lg bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm`} />
            {context.user ? (
              <div className="relative flex flex-col items-center gap-2 bg-neutral-800 rounded p-4">
                <ReviewDialog gameId={details._id} name={details.name} cover={details.coverId} platforms={details.platforms.map(item => platforms.find(platform => platform.id == item))} />
                <StyledRating defaultValue={details.userRating || 0} size="large" readOnly />
                <div className="flex gap-2">
                  {gameActions.map((action, index) => (
                    <button key={index} onClick={() => gameAPI.add(action.status, details.slug)} className="flex flex-col gap-1 text-xs text-white/75 hover:text-white items-center">
                      {action.icon()}
                      <p>{action.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              ) : (
              <></>
            )}
            <div className="relative flex flex-col gap-2 text-white bg-neutral-800 rounded p-2">
              <div className="flex flex-col justify-center items-center">
                <p className="font-light text-white/50">Avg. Rating:</p> 
                <p className="font-semibold text-lg">{details.avgRating.toFixed(1)}</p>
              </div>
              <div className="flex flex-wrap w-full text-white/25 justify-center items-center text-center">
                <div className="w-full flex h-24 gap-1 justify-center">
                  {calculateRatingDistribution(details.reviews).map((rating, index) => (
                    <div key={index} className="flex flex-col w-6 justify-end">
                      <div className={`bg-gradient-to-t from-accentPrimary to-accentSecondary rounded`} style={{ height: `calc(${rating.percent}% + 1px)`}} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-full font-light text-white/75">
                {gameStatuses.map((status, index) => (
                  <Link key={index} to={`/game/${details.slug}/${status.value}`} className="flex w-full px-2 justify-between hover:text-white">
                    {status.element()}
                    <div>{details.statusCounts[status.value]}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Summary and Series */}
        <div className="col-span-3 h-fit">
          <div className="flex flex-col gap-2 p-2">
            <p className="text-white/75">{details.summary}</p>
            <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
          </div>
          {details.seriesSlug ?
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2">
                <p className="font-semibold">Other Games in Series</p>
                <Link to={`/series/${details.seriesSlug}`} className="text-sm font-semibold hover:underline">See more</Link>
              </div>
              <div className="flex h-fit justify-start flex-wrap">
                {details.series.map((game, index) => (
                  <GameCard key={index} size={"basis-[16.66%]"} game={game} />
                ))}
              </div>
            </div> : <></>
          }
        </div>
        {/* Platforms and Genres */}
        <div className="col-span-1 flex flex-col gap-4 px-1">
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
        <div className="col-span-1" />
        {/* Reviews */}
        <div className="col-span-3">
          <div className="flex flex-col gap-4">
            {details.reviews.map((review, index) => (
              <GameReview key={index} review={review} />
            ))}
          </div>
        </div>
        <div className="col-span-1" />
      </div>
    </div>
  )
}

const gameStatuses = [
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoLogoGameControllerB size={"1.25em"}/>
        <p>Played</p>
      </div>
    ),
    value: "played"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosPlay size={"1.25em"}/>
        <p>Playing</p>
      </div>
    ),
    value: "playing"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosBookmarks size={"1.25em"}/>
        <p>Backlog</p>
      </div>
    ),
    value: "backlog"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosGift size={"1.25em"}/>
        <p>Wishlist</p>
      </div>
    ),
    value: "wishlist"
  },
]

const gameActions = [
  {
    status: "playing",
    name: "Playing",
    icon: () => <IoLogoGameControllerB size={"1.25em"}/>
  },
  {
    status: "played",
    name: "Played",
    icon: () => <IoIosPlay size={"1.25em"}/>
  },
  {
    status: "backlog",
    name: "Backlog",
    icon: () => <IoIosBookmarks size={"1.25em"}/>
  },
  {
    status: "wishlist",
    name: "Wishlist",
    icon: () => <IoIosGift size={"1.25em"}/>
  },
]

export default Game