import React from "react"
import SimpleBar from "simplebar-react"
import { ErrorCard, Footer, Navbar } from "./components"
import { Outlet } from "react-router-dom"
import * as Sentry from '@sentry/react'

const SimpleBarStyle = {
  width: '100vw',
  maxHeight: '100vh',
}

const App = () => {
  return (
    <div className="min-h-full h-fit absolute inset-0 z-1 flex flex-col bg-neutral-900 overflow-hidden">
      <Sentry.ErrorBoundary fallback={({ error, componentStack, resetError }) => (
        <React.Fragment>
          <ErrorCard error={error} resetError={resetError} />
        </React.Fragment>
      )}>
        <SimpleBar style={SimpleBarStyle}>
          <Navbar />
          <div className="mt-32 px-48 min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </SimpleBar>
      </Sentry.ErrorBoundary>
    </div>
  )
}

export default App