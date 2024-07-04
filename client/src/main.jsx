import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import "./index.css"
import App from "./App"
import { GameDetails, GamesByCompany, GamesBySeries, GameSearch, Login, Register, SearchResults, Test } from './pages'
import { Navbar } from './components'

const SimpleBarStyle = {
  width: '100vw',
  maxHeight: '100vh',
}

function NavbarWrapper() {
  return (
    <div className="min-h-full h-fit absolute inset-0 z-1 flex flex-col bg-neutral-900 overflow-none">
      <SimpleBar style={SimpleBarStyle}>
        <Navbar />
        <div className="pt-24">
          <Outlet />
        </div>
      </SimpleBar>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: <App />
      },
      {
        path: "/games",
        element: <GameSearch />
      },
      {
        path: "/games/search",
        element: <SearchResults />
      },,
      {
        path: "/games/company/:companyId",
        element: <GamesByCompany />
      },
      {
        path: "/games/series/:seriesId",
        element: <GamesBySeries />
      },
      {
        path: "/game/:gameId",
        element: <GameDetails />
      },
      {
        path: "/test",
        element: <Test />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)