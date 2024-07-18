import SimpleBar from "simplebar-react"
import { Navbar } from "./components"
import { Outlet } from "react-router-dom"

const SimpleBarStyle = {
  width: '100vw',
  maxHeight: '100vh',
}

const App = () => {
  return (
    <div className="min-h-full h-fit absolute inset-0 z-1 flex flex-col bg-indigo-950 overflow-none">
      <SimpleBar style={SimpleBarStyle}>
        <Navbar />
        <div className="pt-24">
          <Outlet />
        </div>
      </SimpleBar>
    </div>
  )
}

export default App