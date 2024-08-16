import { Link } from "react-router-dom"
import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"
import { completionStatuses, platforms } from "../dict"
import PropTypes from 'prop-types'

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

const Review = (props) => {
  return (
    <div className="flex basis-1/2 text-indigo-50 gap-x-2 p-4 border-b">
      <Link to={`/game/${props.review.game[0].gameId}`} className="flex flex-col justify-start h-24">
        <img src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.review.game[0].coverId}.jpg`} className="max-w-full max-h-full object-cover object-center aspect-[45/64] rounded group-hover:brightness-50" />
      </Link>
      <div className="flex flex-col justify-start">
        <div className="text-lg">{props.review.user[0].username} <span className="text-sm text-white/50">reviewed</span> {props.review.game[0].name}</div>
        <div className="flex gap-2 items-center">
          <StyledRating readOnly value={props.review.rating} size="small" />
          <div className="flex gap-1 text-white">
            {completionStatuses.find(status => status.value == props.review.status).element()}
            <p className="text-white/50">on</p> 
            <Link to={{ pathname: "/games", search: `?platform=${props.review.platform}`}} className="text-white">{platforms.find(platform => platform.id == props.review.platform).name}</Link>
          </div>
        </div>
        <div>{props.review.body}</div>
      </div>
    </div>
  )
}

Review.propTypes = {
  review: PropTypes.object
}

export default Review