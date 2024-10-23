import React, { useEffect, useState } from "react"
import SimpleBar from "simplebar-react"
import { ErrorCard, Footer, Navbar } from "./components"
import { Outlet } from "react-router-dom"
import * as Sentry from '@sentry/react'
import { authAPI } from "./api"

const SimpleBarStyle = {
  width: '100vw',
  maxHeight: '100vh',
}

const App = () => {
  const scrollableNodeRef = React.useRef()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAPI.user()
    .then(response => {
      setUser(response)
      setLoading(false)
    })
    .catch(error => console.error(error))
  }, [])

  if (loading) {
    return <div></div>
  }

  return (
    <div className="min-h-full h-fit absolute inset-0 z-1 flex flex-col bg-neutral-900 overflow-hidden">
      <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
        <React.Fragment>
          <ErrorCard error={error} resetError={resetError} />
        </React.Fragment>
      )}>
        <SimpleBar scrollableNodeProps={{ ref: scrollableNodeRef }} style={SimpleBarStyle}>
          <Navbar user={user} />
          <div className="mt-32 px-48 min-h-screen">
            <Outlet context={{ scrollRef: scrollableNodeRef, user: user }} />
          </div>
          <Footer />
        </SimpleBar>
      </Sentry.ErrorBoundary>
    </div>
  )
}

export default App