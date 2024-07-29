import { Link } from "react-router-dom"
import moment from "moment"
import { RxStarFilled } from "react-icons/rx"

export function GameCard(props) {
  return (
    <div key={props.game.game_id} className="flex flex-col items-center gap-2">
      <Link key={props.game.game_id} to={`/game/${props.game.game_id}`} className={`relative ${props.size} w-fit group rounded hover:outline hover:outline-3 hover:outline-[#ff9900]`}>
        <div className="absolute -inset-1 rounded-lg group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] opacity-75 blur-sm" />
        <img loading="lazy" className="max-w-full max-h-full object-cover object-center aspect-[45/64] rounded group-hover:brightness-50" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.game.cover_id}.jpg`} />
        <p className="flex absolute inset-0 p-0.5 items-center justify-center text-center font-semibold text-indigo-50 w-full h-full invisible group-hover:visible">{props.game.name}</p>
      </Link>
      {props.sortBy == "release_date" ? 
        <div className="w-fit h-fit flex justify-center items-center text-yellow-50/75 gap-1 text-sm rounded outline outline-1 px-1 py-0.5">
          {moment.unix(props.game.release_date).format("MM-D-YYYY")}
        </div> : <></>
      }
      {props.sortBy == "avg_rating" ?
        <div className="w-fit h-fit flex justify-center items-center text-yellow-50/75 gap-1 text-sm rounded outline outline-1 px-1 py-0.5">
          <RxStarFilled />{props.game.avg_rating ? props.game.avg_rating.toFixed(1) : (0.0).toFixed(1)}
        </div> : <></>
      }
    </div>
  )
}

export default GameCard