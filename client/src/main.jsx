import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import 'simplebar-react/dist/simplebar.min.css'
import "./index.css"
import App from "./App"
import * as Pages from './pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Pages.Home />
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
        path: "/register",
        element: <Pages.Register />
      },
      {
        path: "/login",
        element: <Pages.Login />
      },
      {
        path: "/profile",
        element: <Pages.Profile />
      },
      {
        path: "/settings",
        element: <Pages.Settings />
      },
      {
        path: "/verify",
        element: <Pages.VerifyEmail />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)