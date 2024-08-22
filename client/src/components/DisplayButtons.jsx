import { RxCross2 } from "react-icons/rx"
import { genres, platforms } from "../dict"
import PropTypes from 'prop-types'

const DisplayButtons = (props) => {
  return (
    <div className="flex gap-2 text-xs font-semibold text-white/75">
      {props.year != null ? (
        <div className="relative h-fit group hover:text-white">
          <div className="absolute -inset-0.5 rounded-xl group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
          <button onClick={() => props.remove('year')} className="relative bg-neutral-700 rounded-full flex p-1 px-2 gap-2 items-center">
            <RxCross2 className="border rounded-full" size={"1.25em"}/>
            <p>{props.year == 0 ? "Status: Released" : props.year == 1 ? "Status: Unreleased" : `Released: ${props.year}`}</p>
          </button>
        </div>
      ) : ""}
      {props.genre != -1 ? (
        <div className="relative group hover:text-white">
          <div className="absolute -inset-0.5 rounded-xl group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
          <button onClick={() => props.remove('genre')} className="relative flex bg-neutral-700 rounded-full p-1 px-2 gap-2 items-center">
            <RxCross2 className="border rounded-full" size={"1.25em"}/>
            <p>Genre: {genres.find(genre => genre.id === props.genre).name}</p>
          </button>
        </div>
      ) : ""}
      {props.platform != -1 ? (
        <div className="relative group hover:text-white">
          <div className="absolute -inset-0.5 rounded-xl group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] blur-sm" />
          <button onClick={() => props.remove('platform')} className="relative flex bg-neutral-700 rounded-full p-1 px-2 gap-2 items-center">
            <RxCross2 className="border rounded-full" size={"1.25em"}/>
            <p>Platform: {platforms.find(platform => platform.id === props.platform).name}</p>
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