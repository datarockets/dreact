import errorCatcher from './errorCatcher'

export default errorCatcher
  .configure({
    source: process.env.REACT_APP_SENTRY_DSN,
    isDebug: process.env.NODE_ENV === 'development',
    environment: process.env.REACT_APP_SENTRY_ENV,
  })
  .start()
