import * as Sentry from '@sentry/browser'

class ErrorCatcher {
  constructor() {
    this.provider = Sentry
    this.params = {}
  }

  get isReady() {
    return this.params.source && this.params.environment
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

  setUser(user) {
    this.provider.setUser(user)

    return this
  }

  addBreadcrumb(breadcrumb) {
    this.provider.addBreadcrumb(breadcrumb)

    return this
  }

  start() {
    if (this.isReady) {
      this._init()
    }

    return this
  }

  report(error, info) {
    if (this.isReady) {
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
      sampleRate: 1,
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.category === 'ui.click' && hint.event.target) {
          const isInteractiveElement = hint.event.target.tabIndex > -1
          const hasTextInside = Boolean(hint.event.target.innerText)

          if (isInteractiveElement && hasTextInside) {
            breadcrumb.message += `{"${hint.event.target.innerText}"}`
          }
        }

        if (breadcrumb.category === 'xhr' && breadcrumb.type === 'http') {
          if (breadcrumb.data.status_code >= 400) {
            breadcrumb.data.response = hint.xhr.responseText
          }
        }

        return breadcrumb
      },
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
