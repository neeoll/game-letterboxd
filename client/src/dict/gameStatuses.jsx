import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"

export const gameStatuses = [
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoLogoGameControllerB size={"1.25em"}/>
        <p>Played</p>
      </div>
    ),
    value: "played"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosPlay size={"1.25em"}/>
        <p>Playing</p>
      </div>
    ),
    value: "playing"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosBookmarks size={"1.25em"}/>
        <p>Backlog</p>
      </div>
    ),
    value: "backlog"
  },
  {
    element: () => (
      <div className="flex gap-1 items-center">
        <IoIosGift size={"1.25em"}/>
        <p>Wishlist</p>
      </div>
    ),
    value: "wishlist"
  },
]