import { useEffect, useState } from "react"
import { Checkbox, Dialog, DialogPanel, Field, Radio, RadioGroup  } from "@headlessui/react"
import 'simplebar-react/dist/simplebar.min.css'
import { RxCheck } from "react-icons/rx"
import DropdownSearch from "./DropdownSearch"
import { completionStatuses } from "../dict/completionStatuses"
import StyledRating from "./StyledRating"
import PropTypes from 'prop-types'
import { reviewAPI } from "../api"

const ReviewDialog = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [status, setStatus] = useState()
  const [rating, setRating] = useState(0)
  const [platform, setPlatform] = useState(-1)
  const [review, setReview] = useState("")
  const [spoiler, setSpoiler] = useState(false)

  useEffect(() => {
    reviewAPI.get(props.gameId)
    .then(response => {
      setStatus(response.status)
      setRating(response.rating)
      setPlatform(response.platform)
      setReview(response.body)
      setSpoiler(response.spoiler)
    })
    .catch(err => console.error(err))
  }, [])

  const submit = async () => {
    reviewAPI.create(rating, platform, review, spoiler, status, props.gameId)
    .then(setDialogOpen(false))
    .catch(err => console.error(err))
  }

  const clear = () => {
    setPlatform(0)
    setRating(0)
    setDialogOpen(false)
  }

  return (
    <div className="flex justify-center items-center">
      <button onClick={() => setDialogOpen(true)} className="w-full bg-gradient-to-r from-accentPrimary to-accentSecondary rounded text-white font-bold rounded p-1 px-2">Leave a Review!</button>
      <Dialog open={dialogOpen} onClose={() => clear()} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-t from-[#ff990055] to-[#ff00ff33]">
          <DialogPanel>
            <div className="flex flex-col gap-4 items-end rounded-lg bg-neutral-900 p-4 text-white/75">
              {/* Header */}
              <div className="flex w-full">
                <p>{props.name}</p>
              </div>
              {/* Body */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-4">
                  <img className="h-44 aspect-[45/64] rounded z-10" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${props.cover}.jpg`} />
                  <RadioGroup value={status} onChange={setStatus} className="flex flex-col gap-1 w-full">
                    {completionStatuses.map((status, index) => (
                      <Field key={index} className="flex items-center justify-center text-white hover:cursor-pointer">
                        <Radio value={status.value} className="w-full group flex items-center justify-center rounded-md p-1 hover:outline outline-1 data-[checked]:bg-gradient-to-r from-accentPrimary to-accentSecondary">
                          {status.name}
                        </Radio>
                      </Field>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <StyledRating defaultValue={rating} onChange={(event, newValue) => setRating(newValue)} size="large"/>
                    <DropdownSearch array={props.platforms} value={platform} setValue={setPlatform} placeholder={"Select Platform"}/>
                  </div>
                  <div className="flex flex-col justify-start gap-2">
                    <p className="text-xl text-white/75">Review</p>
                    <div className="relative w-full h-44">
                      <textarea defaultValue={review} onChange={(e) => setReview(e.target.value)} maxLength={250} className="size-full text-sm rounded p-1 bg-transparent border border-white/50 focus:border-white resize-none"/>
                      <div className="absolute bottom-1 right-1 font-light text-white/50 text-xs">{review?.length || 0}/250</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={spoiler} onChange={setSpoiler} className="flex justify-center items-center group size-4 rounded-full border border-2 bg-neutral-700 data-[checked]:bg-gradient-to-r from-accentPrimary to-accentSecondary data-[checked]:border-none">
                      <RxCheck className="text-neutral-900 opacity-0 group-data-[checked]:opacity-100" />
                    </Checkbox>
                    <p>Mark as a spoiler</p>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex gap-2 justify-end items-center">
                <button onClick={() => clear()} className="size-full rounded p-1 text-white/50 hover:text-white">Cancel</button>
                <div className="w-full relative group">
                  <div className="absolute size-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1"></div>
                  <button onClick={() => submit()} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Submit</button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

ReviewDialog.propTypes = {
  gameId: PropTypes.string,
  name: PropTypes.string,
  cover: PropTypes.string,
  platforms: PropTypes.array
}

export default ReviewDialog