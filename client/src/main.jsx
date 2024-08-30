import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import App from "./App"
import * as Pages from './pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/profile',
        element: <Pages.Profile />
      },
      {
        path: "/settings",
        element: <Pages.Settings />
      },
      {
        path: "/",
        element: <Pages.Home />
      },
      {
        path: "/games",
        element: <Pages.GameSearch />
      },
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
        path: "/login",
        element: <Pages.Login />
      },
      {
        path: "/reset-password",
        element: <Pages.PasswordReset />
      },
      {
        path: "/register",
        element: <Pages.Register />
      },
      {
        path: "/games/search",
        element: <Pages.SearchResults />
      },
      {
        path: '/password-reset-form',
        element: <Pages.SendResetLink />
      },
      {
        path: "/verify-email",
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