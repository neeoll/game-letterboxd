import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import defaultImg from "../assets/default_profile.png"
import { completionStatuses, platforms } from "../dict"
import StyledRating from "./StyledRating"

export const HomeReview = (props) => {
  return (
    <div className="flex flex-col basis-1/2 gap-2 p-4">
      <div className="flex gap-2 text-white">
        <Link to={`/game/${props.review.game[0].gameId}`} className="h-20">
          <img className="size-full object-cover aspect-[45/64] rounded" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.review.game[0].coverId}.jpg`} />
        </Link>
        <div className="flex flex-col text-white">
          <div>{props.review.user[0].username} <span className="text-white/50">reviewed</span> {props.review.game[0].name}</div>
          <div className="flex gap-2 items-center">
            <StyledRating readOnly value={props.review.rating} size="small" />
            <div className="flex gap-1">
              {completionStatuses.find(status => status.value == props.review.status).element()}
              <p className="text-white/50">on</p> 
              <Link to={{ pathname: "/games", search: `?platform=${props.review.platform}`}}>{platforms.find(platform => platform.id == props.review.platform).name}</Link>
            </div>
          </div>
          <div>{props.review.body}</div>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
    </div>
  )
}

HomeReview.propTypes = {
  review: PropTypes.object
}

export const GameReview = (props) => {
  return (
    <div className="flex flex-col py-4 gap-2">
      <div className="flex gap-2 text-white">
        <img src={props.review.user.profileIcon || defaultImg} className="size-10 rounded-lg" />
        <div className="flex flex-col gap-1">
          <div>{props.review.user.username}</div>
          <div className="flex gap-2 items-center">
            <StyledRating readOnly value={props.review.rating} size="small" />
            <div className="flex gap-1">
              {completionStatuses.find(status => status.value == props.review.status).element()}
              <span className="text-white/50">on</span> 
              <Link to={{ pathname: "/games", search: `?platform=${props.review.platform}`}}>{platforms.find(platform => platform.id == props.review.platform).name}</Link>
            </div>
          </div>
          <div>{props.review.body}</div>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-accentPrimary to-accentSecondary" />
    </div>
  )
}

GameReview.propTypes = {
  review: PropTypes.object
}