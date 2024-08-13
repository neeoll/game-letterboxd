import Slider from "@mui/material/Slider"
import PropTypes from 'prop-types'

const ValueSlider = (props) => {
  return (
    <Slider 
      value={props.value} 
      min={props.min} 
      max={props.max} 
      step={props.step}
      track={false} 
      onChange={(e) => props.onChange(e.target.value)}
      sx={{
        '& .MuiSlider-thumb': {
          width: 14,
          height: 14,
          backgroundColor: 'rgb(64, 64, 64)',
          opacity: 1,
          '&:hover, &.Mui-focusVisible': {
            width: 20,
            height: 20,
            boxShadow: `0px 0px 0px 6px #ff990077`,
          },
          '&.Mui-active': {
            backgroundColor: 'rgb(38, 38, 38)',
            boxShadow: `0px 0px 0px 8px #ff00ff44`,
          },
        },
        '& .MuiSlider-rail': {
          backgroundImage: 'linear-gradient(to right, #ff9900, #ff00ff)',
          opacity: 0.75
        }
      }}
    />
  )
}

ValueSlider.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func
}

export default ValueSlider