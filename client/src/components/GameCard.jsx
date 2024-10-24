import { Link } from "react-router-dom"
import { RxStarFilled } from "react-icons/rx"
import PropTypes from 'prop-types'
import { timestamps } from "../utils"

const GameCard = (props) => {
  return (
    <div className={`flex flex-col ${props.size} grow-0 shrink-0 p-1 items-center gap-2 text-sm`}>
      <Link to={`/game/${props.game.slug}`} className="relative size-full group rounded hover:outline outline-3 outline-accentPrimary">
        <div className="absolute -inset-1 rounded-lg group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary opacity-75 blur-sm" />
        <img loading="lazy" className="size-full object-cover aspect-[45/64] rounded group-hover:brightness-50" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.game.coverId}.jpg`} />
        <p className="flex absolute inset-0 p-1 items-center justify-center text-center font-semibold text-white invisible group-hover:visible">{props.game.name}</p>
      </Link>
      {props.sortBy == "releaseDate" ? 
        <div className="flex text-white/75 rounded outline outline-1 p-1">{timestamps.default(props.game.releaseDate)}</div> : <></>
      }
      {props.sortBy == "avgRating" ?
        <div className="flex items-center text-white/75 gap-1 rounded outline outline-1 p-1">
          <RxStarFilled />{(props.game.avgRating || 0).toFixed(1)}
        </div> : <></>
      }
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object,
  sortBy: PropTypes.string,
  size: PropTypes.string
}

export default GameCard