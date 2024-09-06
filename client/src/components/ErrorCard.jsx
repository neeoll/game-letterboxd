import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const ErrorCard = ({ error, resetError }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center flex-wrap mt-24 mx-96 p-10 text-white bg-neutral-800 rounded-lg">
      {!error.response ? (
        <div className="flex flex-col justify-center items-center gap-4">
          {/* Error Message */}
          <div className="relative text-transparent text-7xl font-edunline">
            <p className="absolute inset-0 blur-sm bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
              {error.message}
            </p>
            <p className="bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
              {error.message}
            </p>
          </div>
          {/* Content */}
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-white/75 font-light text-sm">
              <p className="text-center">Your request to the server timed out.</p>
              <p className="text-center">Please check your connection and try again, or contact us f the problem persists.</p>
            </div>
          </div>
          <div className="max-w-full">
            <details className="open:bg-neutral-900 open:ring-1 open:ring-white/10 p-6 rounded-lg">
              <summary className="text-sm text-white font-semibold select-none">
                Details
              </summary>
              <div className="mt-3 text-sm text-white/50">
                <p>{error.stack}</p>
              </div>
            </details>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          {/* Status and Error Name */}
          <div className="flex flex-col justify-center items-center">
            <div className="relative text-transparent text-7xl font-edunline">
              <p className="absolute inset-0 blur-sm bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
                {error.response.status}
              </p>
              <p className="bg-gradient-to-r from-accentPrimary to-accentSecondary bg-clip-text">
                {error.response.status}
              </p>
            </div>
            {error.response.status == 500 ? <p>Internal Server Error</p> : <></>}
            {error.response.status == 404 ? <p>Page Not Found</p> : <></>}
          </div>
          {error.response.status == 500 ? 
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-white/75 font-light text-sm">
                <p className="text-center">Oops, something went wrong.</p>
                <p className="text-center">Try to <button onClick={() => resetError()} className="text-white">refresh</button> this page, or contact us if the problem persists.</p>
              </div>
            </div> : 
            <></>
          }
          {error.response.status == 404 ? 
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-white/75 font-light text-sm">
                <p className="text-center">The page you are trying to visit might have been removed, had its name changed, or be temporarily unavailable.</p>
                <p className="text-center">We apologize for the inconvenience.</p>
              </div>
              <button onClick={() => navigate('/games')}className="p-1 px-2 rounded bg-gradient-to-r from-accentPrimary to-accentSecondary">Take me back home!</button>
            </div> : 
            <></>
          }
          <div className="max-w-full">
            <details className="open:bg-neutral-900 open:ring-1 open:ring-white/10 p-6 rounded-lg">
              <summary className="text-sm text-white font-semibold select-none">
                Details
              </summary>
              <div className="mt-3 text-sm text-white/50">
                <p>{error.stack}</p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}

ErrorCard.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func
}

export default ErrorCard