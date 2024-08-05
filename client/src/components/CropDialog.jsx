import { useRef, useState } from "react"
import { Dialog, DialogPanel } from "@headlessui/react"
import Cropper from 'react-easy-crop'
import getCroppedImg from "../utils/cropImage"
import ValueSlider from "./ValueSlider"

const CropDialog = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const fileUpload  = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const handleFileUpload = () => {
    fileUpload.current.click()
  }

  const resetTransforms = () => {
    setCrop({ x: 0, y: 0})
    setZoom(1)
    setRotation(0)
  }

  const onFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      resetTransforms()
      setImgSrc(URL.createObjectURL(e.target.files[0]))
      setDialogOpen(true)
      e.target.value = null
    }
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCroppedImg = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        rotation
      )
      setCroppedImage(croppedImage)
      props.setProfileIcon(croppedImage)
      setDialogOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const clear = () => {
    setImgSrc(null)
    resetTransforms()
    setDialogOpen(false)
  }

  return (
    <div className="flex justify-center items-center">
      {croppedImage ? 
        <img onClick={() => handleFileUpload()} className="size-40 rounded-full" src={croppedImage} /> : 
        <button onClick={() => handleFileUpload()} className="size-40 rounded-full bg-neutral-600"></button>
      }
      <input ref={fileUpload} type="file" accept="image/*" onChange={onFileUpload} className="invisible size-0"/>
      <Dialog open={dialogOpen} onClose={() => clear()} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-t from-[#ff990055] to-[#ff00ff33]">
          <DialogPanel>
            <div className="flex p-4 gap-2 bg-neutral-800 rounded text-white">
              {imgSrc ? (
                <div className="flex flex-col gap-2">
                  <div className="relative size-96">
                    <Cropper 
                      image={imgSrc}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      cropSize={{width: 150, height: 150}}
                      zoomWithScroll
                      restrictPosition
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <p>Zoom</p>
                  <ValueSlider value={zoom} min={1} max={3} step={0.1} onChange={setZoom} />
                  <p>Rotation</p>
                  <ValueSlider value={rotation} min={0} max={360} step={1} onChange={setRotation} />
                  <button onClick={handleCroppedImg} className="p-1">Submit</button>
                </div>
                ) : (
                <></>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default CropDialog