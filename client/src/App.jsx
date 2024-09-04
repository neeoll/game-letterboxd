import SimpleBar from "simplebar-react"
import { Footer, Navbar } from "./components"
import { Outlet } from "react-router-dom"

const SimpleBarStyle = {
  width: '100vw',
  maxHeight: '100vh',
}

const App = () => {
  return (
    <div className="min-h-full h-fit absolute inset-0 z-1 flex flex-col bg-neutral-900 overflow-hidden">
      <SimpleBar style={SimpleBarStyle}>
        <Navbar />
        <div className="mt-32 px-48 min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </SimpleBar>
    </div>
  )
}

export default App