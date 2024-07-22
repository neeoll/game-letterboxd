import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"
import moment from "moment"
import { reviews } from "../temp/reviewPlaceholder"
import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"
import { completion_statuses, platforms, genres } from "../dict"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

const calculateRatingDistribution = (ratings) => {
  const ratingArray = []
  ratings.forEach(rating => {
    ratingArray.push(rating.value)
  })

  return [
    { value: 1, percent: Math.floor((ratingArray.filter(rating => rating == 1).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 1).length },
    { value: 2, percent: Math.floor((ratingArray.filter(rating => rating == 2).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 2).length },
    { value: 3, percent: Math.floor((ratingArray.filter(rating => rating == 3).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 3).length },
    { value: 4, percent: Math.floor((ratingArray.filter(rating => rating == 4).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 4).length },
    { value: 5, percent: Math.floor((ratingArray.filter(rating => rating == 5).length / ratingArray.length) * 100), count: ratingArray.filter(rating => rating == 5).length },
  ]
}

const GameDetails = () => {
  const { game_id } = useParams()

  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [ratingDistributions, setRatingDistributions]  = useState([])

  useEffect(() => {
    async function getDetails() {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:5050/game/${game_id}`, {
        headers: {
          'view-token': localStorage.getItem(`${game_id}_view_token`),
          'authorization': localStorage.getItem('jwt-token')
        }
      })
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`
        console.error(message)
        return
      }
      const json = await response.json()

      console.log(json)
      
      if (json.token) localStorage.setItem(`${game_id}_view_token`, json.token)
      
      setDetails(json.data)
      json.data.ratings ? setRatingDistributions(calculateRatingDistribution(json.data.ratings)) : console.log("no ratings")
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

  async function rateGame(rating) {
    console.log(rating)
    const response = await fetch('http://127.0.0.1:5050/game/rateGame', {
      method: 'POST',
      body: JSON.stringify({ game_id: game_id, rating: rating}),
      headers: {
        'authorization': localStorage.getItem('jwt-token'),
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
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
          <img className="max-w-40 rounded border border-black z-10" src={details.cover_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${details.cover_id}.jpg` : ''} />
        </div>
        <div className="flex flex-col w-4/5 gap-1">
          <h1 className="text-5xl font-semibold text-indigo-100">{details.name}</h1>
          <div className="flex gap-2 text-xl text-indigo-100/50">
            <p>Released on</p> 
            <Link to={{ pathname: "/games", search: `?year=${moment.unix(details.release_date).year()}`}} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{moment.unix(details.release_date).format("MMM D, YYYY")}</Link>
            {details.companies ? (
              <>
                <p>by</p> 
                <Link to={`/games/company/${details.companies[0].company_id}`} className="text-indigo-100/75 font-semibold hover:text-indigo-50">{details.companies[0].name}</Link>
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
                <StyledRating defaultValue={details.userRating || 0} onChange={(event, newValue) => rateGame(newValue)} size="large"/>
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
            <p className="font-bold text-3xl">{(details.avg_rating || 0).toFixed(1)}</p>
            <div className="flex flex-wrap w-full text-indigo-50/25 justify-center items-center text-center">
              <div className="w-full flex h-24 gap-1 border-b border-l">
                {ratingDistributions.map(rating => (
                  <div className="flex flex-col w-1/5 justify-end">
                    <div className={`bg-amber-400 rounded-t`} style={{ height: `calc(${rating.percent}% + ${rating.percent}px)`}} />
                  </div>
                ))}
              </div>
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
                        <Link to={`/games/series/${details.collections[0]}`} className="text-sm font-semibold text-indigo-300 hover:underline">See more</Link>
                      </div>
                      <div className="flex w-full h-fit flex-wrap gap-2 justify-start">
                        {details.collection.map(game => (
                          <Link key={game.game_id} to={`/game/${game.game_id}`} className="relative h-36 group text-indigo-50 font-semibold">
                            <img className="max-w-full max-h-full rounded group-hover:brightness-50" src={game.cover_id ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover_id}.jpg` : ""} />
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
                  <div key={platform} className="flex gap-1 items-center text-sm border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                    <IoLogoGameControllerB />
                    <Link to={{ pathname: "/games", search: `?platform=${platform}`}}>{platforms.find(plat => plat.id == platform).name}</Link>
                  </div>
                )}
              </div>
              <p className="font-bold">Genres</p>
              <div className="flex flex-wrap gap-2">
                {details.genres.map(genre => 
                  <div key={genre} className="w-fit text-xs border border-indigo-100/75 rounded p-1 hover:border-indigo-500">
                    <Link to={{ pathname: "/games", search: `?genre=${genre}`}}>{genres.find(gen => gen.id == genre).name}</Link>
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
                      <p className="text-indigo-50/50">on <Link to={{ pathname: "/games", search: `?platform=${details.platforms[0]}`}} className="text-indigo-50">{platforms.find(platform => platform.id == details.platforms[0]).name}</Link></p>
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