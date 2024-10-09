import { forwardRef, useRef, useState } from "react"
import { CloseButton, Dialog, DialogPanel } from "@headlessui/react"
import Croppie from "croppie"
import "croppie/croppie.css"
import _ from "lodash"
import { GrRotateLeft, GrRotateRight } from 'react-icons/gr'
import { RxCross2 } from 'react-icons/rx'
import Slider from "@mui/material/Slider"
import defaultImg from "../assets/default_profile.png"
import PropTypes from 'prop-types'

const croppieOptions = {
  showZoomer: false,
  enableOrientation: true,
  viewport: { width: 300, height: 300, type: 'circle' },
  boundary: { width: 300, height: 300 }
}

const CropDialog = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [croppedImage, setCroppedImage] = useState(null)
  const fileUpload = useRef(null)
  const croppieElementRef = useRef(null)
  const croppieInstanceRef = useRef(null)
  const sliderRef = useRef(null)

  const resultDebounce = _.debounce(() => resultCrop(), 100)

  const resultCrop = () => {
    croppieInstanceRef.current.result({ type: "base64", circle: true }).then((base64) => {
      setCroppedImage(base64)
    })
  }

  const handleFileUpload = () => { fileUpload.current.click() }
  const changeOrientation = (value) => { 
    croppieInstanceRef.current.rotate(value)
    resultDebounce()
  }
  const handleZoom = (value) => { 
    croppieInstanceRef.current.setZoom(value)
    resultDebounce()
  }

  const onFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDialogOpen(true)
      const reader = new FileReader()
      const file = e.target.files[0]

      reader.readAsDataURL(file)
      reader.onload = async () => {
        if (!croppieInstanceRef.current) {
          croppieInstanceRef.current = new Croppie(
            croppieElementRef.current,
            croppieOptions
          )
        }
        await croppieInstanceRef.current.bind({ url: reader.result })
        resultCrop()
        const { zoom } = croppieInstanceRef.current.get()
        sliderRef.current.setMin(zoom)
      }
      reader.onerror = (error) => {
        console.log("Error: ", error)
      }
    }
  }

  const clear = () => {
    croppieInstanceRef.current = null
    fileUpload.current.value = null
    setDialogOpen(false)
  }

  const crop = () => {
    croppieInstanceRef.current.result("base64").then((base64) => {
      props.setUri(base64)
      setCroppedImage(base64)
      setDialogOpen(false)
    })
    croppieInstanceRef.current = null
    fileUpload.current.value = null
  }

  return (
    <div className="flex justify-center items-center">
      <img onClick={handleFileUpload} className="size-40 rounded-full bg-neutral-600 outline-none " src={croppedImage || props.profileIcon || defaultImg} />
      <input ref={fileUpload} type="file" accept="image/*" onChange={onFileUpload} className="invisible size-0"/>
      <Dialog open={dialogOpen} onClose={clear} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-t from-[#ff990055] to-[#ff00ff33]">
          <DialogPanel className="w-1/2">
            <div className="flex flex-col p-4 gap-6 bg-neutral-900 rounded-md text-white outline outline-1 outline-white/25">
              <div className="flex justify-between text-2xl text-white/75">
                <p className="font-semibold">Crop Photo</p>
                <CloseButton className="hover:text-white"><RxCross2 /></CloseButton>
              </div>
              <div className="flex">
                <div className="basis-1/2 flex flex-col w-full gap-1">
                  <div ref={croppieElementRef} />
                  <div className="flex w-full gap-4">
                    <button onClick={() => changeOrientation(90)} className="text-2xl text-white/50 hover:text-white"><GrRotateLeft /></button>
                    <CustomSlider ref={sliderRef} min={0} max={1.5} step={0.01} onChange={handleZoom} />
                    <button onClick={() => changeOrientation(-90)} className="text-2xl text-white/50 hover:text-white"><GrRotateRight /></button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <div className="basis-1/2 flex items-center w-full gap-1">
                    <img src={croppedImage || null} className="size-36 rounded-full"/>
                    <img src={croppedImage || null} className="size-20 rounded-full"/>
                    <img src={croppedImage || null} className="size-16 rounded-full"/>
                    <img src={croppedImage || null} className="size-12 rounded-full"/>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleFileUpload}>Change Photo</button>
                    <button onClick={crop} className="p-1 px-4 bg-gradient-to-r from-accentPrimary to-accentSecondary rounded">Save Photo</button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

const sliderStyle = {
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
}

const CustomSlider = forwardRef((props, ref) => {
  const [min, setMin] = useState(props.min)
  ref.current = { setMin }
  return (
    <Slider min={min} max={props.max} step={props.step} track={false} onChange={(e) => props.onChange(e.target.value)} sx={sliderStyle} />
  )
})

CustomSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func
}

CropDialog.propTypes = {
  profileIcon: PropTypes.string,
  setUri: PropTypes.func
}

export default CropDialog