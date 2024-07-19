import { Link } from "react-router-dom"
import moment from "moment"
import { RxStarFilled } from "react-icons/rx"

export function GameCard(props) {
  return (
    <div key={props.game.game_id} className="flex flex-col items-center gap-2">
      <Link key={props.game.game_id} to={`/game/${props.game.game_id}`} className="relative h-56 group hover:rounded hover:outline hover:outline-3 hover:outline-amber-200 hover:outline-offset-3 hover:shadow-[0_0_10px_5px_rgba(252,211,77,0.75)]">
        <img loading="lazy" className="max-w-full max-h-full rounded group-hover:brightness-50" src={`https://images.igdb.com/igdb/image/upload/t_720p/${props.game.cover_id}.jpg`} />
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