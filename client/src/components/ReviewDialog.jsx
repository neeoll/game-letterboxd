import { useState } from "react";
import { Checkbox, Dialog, DialogPanel, Field, Radio, RadioGroup  } from "@headlessui/react";
import 'simplebar-react/dist/simplebar.min.css';
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material";
import { RxCheck } from "react-icons/rx";
import DropdownSearch from "./DropdownSearch";

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ffffff55',
  }
})

export const gameStatuses = [
  {
    id: 1,
    name: "Completed",
    value: "completed"
  },
  {
    id: 2,
    name: "Played",
    value: "played"
  },
  {
    id: 3,
    name: "Shelved",
    value: "shelved"
  },
  {
    id: 4,
    name: "Abandoned",
    value: "abandoned"
  },
]

const ReviewDialog = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [status, setStatus] = useState()
  const [rating, setRating] = useState(0)
  const [platform, setPlatform] = useState(0)
  const [review, setReview] = useState("")
  const [spoiler, setSpoiler] = useState(false)

  const submit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game/review`, {
        method: 'POST',
        body: JSON.stringify({ rating: rating, platform: platform, review: review, spoiler: spoiler, status: status, gameId: props.gameId }),
        headers: {
          'authorization': localStorage.getItem('jwt-token'),
          'content-type': 'application/json'
        },
      })
      const data = await response.json()
    } catch (err) {
      alert(err)
    }
  }

  const clear = () => {
    setPlatform(0)
    setRating(0)
    setDialogOpen(false)
  }

  return (
    <div className="flex justify-center items-center">
      <button onClick={() => setDialogOpen(true)} className="w-full bg-gradient-to-r from-[#ff9900] to-[#ff00ff] rounded text-white font-bold rounded p-1 px-2">Log or Review</button>
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
                    {gameStatuses.map((status) => (
                      <Field key={status.id} className="flex items-center justify-center text-white hover:cursor-pointer">
                        <Radio value={status.value} className="w-full group flex items-center justify-center rounded-md p-1 bg-neutral-800 data-[checked]:bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
                          {status.name}
                        </Radio>
                      </Field>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <StyledRating defaultValue={0} onChange={(event, newValue) => setRating(newValue)} size="large"/>
                    <DropdownSearch array={props.platforms} value={platform} setValue={setPlatform} placeholder={"Select Platform"}/>
                  </div>
                  <div className="flex flex-col justify-start gap-2">
                    <p className="text-xl text-white/75">Review</p>
                    <textarea onChange={(e) => setReview(e.target.value)} className="rounded p-1 bg-neutral-700" rows={5} cols={50}/>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={spoiler} onChange={setSpoiler} className="flex justify-center items-center group size-4 rounded-full border border-2 bg-neutral-700 data-[checked]:bg-gradient-to-r from-[#ff9900] to-[#ff00ff] data-[checked]:border-none">
                      <RxCheck className="text-neutral-900 opacity-0 group-data-[checked]:opacity-100" />
                    </Checkbox>
                    <p>Mark as a spoiler</p>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex gap-2 justify-end items-center">
                <button onClick={() => clear()} className="w-full h-full h-6 rounded bg-neutral-600 p-1 text-indigo-50 hover:bg-red-700">Cancel</button>
                <div className="w-full relative group">
                  <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1"></div>
                  <button onClick={() => submit()} className="relative w-full rounded text-white bg-gradient-to-r from-[#ff9900] to-[#ff00ff] p-1">Submit</button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default ReviewDialog