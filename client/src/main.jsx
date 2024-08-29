import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import App from "./App"
import * as Pages from './pages'
import ProtectedRoute from "./ProtectedRoute"
import axios from "axios"

const isAuthenticated = async () => {
  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/checkAuthentication`, {
    withCredentials: true
  })
  .then(res => { return res.data })
  .catch(err => console.error(err))
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute isAuthenticated={await isAuthenticated()} />,
        children: [
          {
            path: '/profile',
            element: <Pages.Profile />
          },
          {
            path: "/settings",
            element: <Pages.Settings />
          },
        ]
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
        element: <Pages.GameDetails isAuthenticated={await isAuthenticated()} />
      },
      {
        path: "/login",
        element: <Pages.Login isAuthenticated={await isAuthenticated()} />
      },
      {
        path: "/reset-password",
        element: <Pages.PasswordReset />
      },
      {
        path: "/register",
        element: <Pages.Register isAuthenticated={await isAuthenticated()} />
      },
      {
        path: "/games/search",
        element: <Pages.SearchResults />
      },
      {
        path: '/password-reset-form',
        element: <Pages.SendResetLink isAuthenticated={await isAuthenticated()}/>
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