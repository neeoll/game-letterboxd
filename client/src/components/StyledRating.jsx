import Rating from '@mui/material/Rating'
import { styled } from "@mui/material"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

export default StyledRating