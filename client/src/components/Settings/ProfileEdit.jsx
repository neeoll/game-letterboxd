import { useState } from "react"
import CropDialog from '../CropDialog'
import axios from "axios"
import PropTypes from 'prop-types'

const ProfileEdit = (props) => {
  const [uri, setUri] = useState()
  const [username, setUsername] = useState(null)
  const [usernameValid, setUsernameValid] = useState(true)
  const [bio, setBio] = useState(null)

  const submitChanges = async () => {
    const formData = new FormData()
    formData.append('image', uri)
    formData.append('username', username)
    formData.append('bio', bio)
    
    axios.post('/user/update', formData)
    .then(res => {
      console.log(res.data)
      window.location.reload()
    })
    .catch(err => {
      console.error(err)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <CropDialog profileIcon={props.user.profileIcon} setUri={setUri} />
        </div>
        <div className="flex flex-col w-96 justify-center items-center gap-2">
          {/* Username */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Username</p>
            <input 
              onChange={(e) => {
                setUsernameValid(true)
                setUsername(e.target.value)
              }}
              type="text"
              placeholder={props.user.username}
              className="w-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 outline-none"
              maxLength={16}
            />
            <p className={`${usernameValid ? "invisible h-0" : "visible h-fit"} text-pink-500 text-sm`}>{`"${username}" is already in use.`}</p>
          </div>
          {/* Bio */}
          <div className="flex flex-col w-full items-start">
            <p className="text-sm text-white/50 font-extralight">Bio</p>
            <div className="relative w-full h-28">
              <textarea 
                onChange={(e) => setBio(e.target.value)}
                defaultValue={props.user.bio}
                maxLength={250}
                className="size-full p-1 rounded bg-transparent border border-white/50 focus:border-white text-white/75 text-sm outline-none resize-none peer"
              />
              <p className="absolute bottom-1 right-1 font-light text-white/50 text-xs">{bio?.length || 0}/250</p>
            </div>
          </div>
          <div className={`relative w-96 group ${(username || bio || uri) != null ? "" : "size-0 invisible"}`}>
            <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</div>
            <button onClick={submitChanges} className="relative w-full rounded text-white bg-gradient-to-r from-accentPrimary to-accentSecondary p-1">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileEdit.propTypes = {
  user: PropTypes.object
}

export default ProfileEdit