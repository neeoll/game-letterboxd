import { RxCross2 } from "react-icons/rx"
import { genres, platforms } from "../dict"
import PropTypes from 'prop-types'

const DisplayButtons = (props) => {
  return (
    <div className="flex gap-2 text-xs font-semibold text-white/75">
      {props.year != null ? (
        <div className="relative group hover:text-white">
          <div className="absolute w-full h-full rounded-full group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary blur-sm" />
          <button onClick={() => props.remove('year')} className="relative bg-neutral-700 rounded-full py-1 px-2">
            <div className="flex gap-2 items-center">
              <RxCross2 className="border rounded-full" />
              <p>{props.year == 0 ? "Status: Released" : props.year == 1 ? "Status: Unreleased" : `Released: ${props.year}`}</p>
            </div>
          </button>
        </div>
      ) : ""}
      {props.genre != -1 ? (
        <div className="relative group hover:text-white">
          <div className="absolute w-full h-full rounded-full group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary blur-sm" />
          <button onClick={() => props.remove('genre')} className="relative bg-neutral-700 rounded-full py-1 px-2">
            <div className="flex gap-2 items-center">
              <RxCross2 className="border rounded-full" />
              <p>Genre: {genres.find(genre => genre.id === props.genre).name}</p>
            </div>
          </button>
        </div>
      ) : ""}
      {props.platform != -1 ? (
        <div className="relative group hover:text-white">
          <div className="absolute w-full h-full rounded-full group-hover:bg-gradient-to-t from-accentPrimary to-accentSecondary blur-sm" />
          <button onClick={() => props.remove('platform')} className="relative bg-neutral-700 rounded-full py-1 px-2">
            <div className="flex gap-2 items-center">
              <RxCross2 className="border rounded-full" />
              <p>Platform: {platforms.find(platform => platform.id === props.platform).name}</p>
            </div>
          </button>
        </div>
      ) : ""}
    </div>
  )
}

DisplayButtons.propTypes = {
  year: PropTypes.number,
  genre: PropTypes.number,
  platform: PropTypes.number,
  remove: PropTypes.func
}

export default DisplayButtons