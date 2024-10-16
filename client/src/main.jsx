import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from "axios"
import "./index.css"
import App from "./App"
import * as Pages from './pages'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.headers = {
  'Access-Control-Allow-Origin': '*',
  'authorization': localStorage.getItem('accessToken')
}

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '/profile', element: <Pages.Profile /> },
      { path: '/user/:username', element: <Pages.User /> },
      { path: "/settings", element: <Pages.Settings /> },
      { path: "/", element: <Pages.Home /> },
      { path: "/games", element: <Pages.Games /> },
      { path: "/company/:slug", element: <Pages.Company /> },
      { path: "/series/:slug", element: <Pages.Series /> },
      { path: "/game/:slug", element: <Pages.Game /> },
      { path: '/game/:slug/:status', element: <Pages.Status /> },
      { path: "/login", element: <Pages.Login /> },
      { path: "/reset-password", element: <Pages.PasswordReset /> },
      { path: "/register", element: <Pages.Register /> },
      { path: "/games/search", element: <Pages.Search /> },
      { path: '/password-reset-form', element: <Pages.SendResetLink /> },
      { path: "/verify-email", element: <Pages.VerifyEmail /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)