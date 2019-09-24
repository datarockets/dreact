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

  _init() {
    this.provider.init({
      dsn: this.params.source,
      debug: this.params.isDebug,
      environment: this.params.environment,
      attachStacktrace: true,
    })
  }
}

export default new ErrorCatcher()
