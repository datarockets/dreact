import * as Sentry from '@sentry/browser'

class ErrorCatcher {
  constructor() {
    this.provider = Sentry
    this.params = {}
  }

  configure(params = {}) {
    this.params = {
      source: params.source,
      isDebug: params.isDebug,
      environment: params.environment,
      ...this.params,
    }

    return this
  }

  start() {
    if (this.params.source) {
      this._init()
    }

    return this
  }

  report(error, info) {
    if (this.params.source) {
      this._handleReport(error, info)
    }

    return this
  }

  _init() {
    this.provider.init({
      dsn: this.params.source,
      debug: this.params.isDebug,
      environment: this.params.environment,
      attachStacktrace: true,
    })
  }

  _handleReport(error, info = {}) {
    this.provider.configureScope(scope => {
      Object.keys(info).forEach(key => scope.setExtra(key, info[key]))
    })

    this.provider.captureException(error)
  }
}

export default new ErrorCatcher()
