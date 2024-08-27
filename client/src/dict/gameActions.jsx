import { IoLogoGameControllerB, IoIosPlay, IoIosGift, IoIosBookmarks } from "react-icons/io"

export const gameActions = [
  {
    status: "playing",
    name: "Playing",
    icon: () => <IoLogoGameControllerB size={"1.25em"}/>
  },
  {
    status: "played",
    name: "Played",
    icon: () => <IoIosPlay size={"1.25em"}/>
  },
  {
    status: "backlog",
    name: "Backlog",
    icon: () => <IoIosBookmarks size={"1.25em"}/>
  },
  {
    status: "wishlist",
    name: "Wishlist",
    icon: () => <IoIosGift size={"1.25em"}/>
  },
]