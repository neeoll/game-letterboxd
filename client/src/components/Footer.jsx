import { Link } from "react-router-dom"
import { RxGithubLogo, RxLinkedinLogo, RxTwitterLogo } from "react-icons/rx"

const Footer = () => {
  return (
    <div className="flex justify-between items-center bg-neutral-800 text-white px-40 py-2">
      {/* Title Card */}
      <div>
        <div className="font-edunline text-3xl text-transparent bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
          <Link to={"/"}>Arcade Archives</Link>
        </div>
        <p className="font-light text-sm text-white/75">Data provided by <Link to="https://www.igdb.com/api" target="_blank" rel="noopener noreferrer" className="hover:text-white">IGDB</Link></p>
      </div>
      {/* Social Media */}
      <div className="flex gap-4 text-white/75 text-2xl">
        <Link to="https://www.linkedin.com/in/noel-arias" target="_blank" rel="noopener noreferrer" className="hover:text-white"><RxLinkedinLogo /></Link>
        <Link to="https://github.com/neeoll" target="_blank" rel="noopener noreferrer" className="hover:text-white"><RxGithubLogo /></Link>
        <Link target="_blank" rel="noopener noreferrer" className="hover:text-white"><RxTwitterLogo /></Link>
      </div>
    </div>
  )
}

export default Footer