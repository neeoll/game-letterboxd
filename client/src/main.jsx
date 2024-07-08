import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import SimpleBar from "simplebar-react"
import 'simplebar-react/dist/simplebar.min.css'
import "./index.css"
import App from "./App"
import * as Pages from './pages'
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
        element: <Pages.Profile />
      },
      {
        path: "/games",
        element: <Pages.GameSearch />
      },
      {
        path: "/games/search",
        element: <Pages.SearchResults />
      },,
      {
        path: "/games/company/:companyId",
        element: <Pages.GamesByCompany />
      },
      {
        path: "/games/series/:seriesId",
        element: <Pages.GamesBySeries />
      },
      {
        path: "/game/:gameId",
        element: <Pages.GameDetails />
      },
      {
        path: "/test",
        element: <Pages.Test />
      },
      {
        path: "/register",
        element: <Pages.Register />
      },
      {
        path: "/login",
        element: <Pages.Login />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)