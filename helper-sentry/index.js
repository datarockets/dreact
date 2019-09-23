import * as Sentry from '@sentry/browser'

const ErrorCatcher = {
  configure(params = {}) {
    this.params = {
      source: params.source,
      isDebug: params.isDebug,
      environment: params.environment,
    }

    return this
  },

  start() {
    if (this.params && this.params.source) {
      Sentry.init({
        dsn: this.params.source,
        debug: this.params.isDebug,
        environment: this.params.environment,
        attachStacktrace: true,
      })
    }

    return this
  },
}

export default ErrorCatcher
