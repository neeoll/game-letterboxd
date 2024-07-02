import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import GameSearch from "./pages/GameSearch"
import "./index.css";
import GameDetails from "./pages/GameDetails";
import GamesByCompany from "./pages/GamesByCompany";
import GamesBySeries from "./pages/GamesBySeries"
import SearchResults from "./pages/SearchResults";
import Test from "./pages/Test";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
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
  },
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);