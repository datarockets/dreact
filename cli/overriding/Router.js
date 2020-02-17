const path = require('path')
const { parse } = require('url')

const CWD = process.cwd()
const PATH_TO_ROUTER = path.resolve(CWD, 'src', 'router')

class Router {
  constructor(app) {
    this._app = app
    this._routes = []
  }

  getRequestHandler() {
    const nextHandler = this._app.getRequestHandler()

    return (req, res) => {
      const { route, parsedUrl } = this.match(req.url)

      if (route) {
        this._app.render(req, res, route.getComponent(), parsedUrl.query)
      } else {
        nextHandler(req, res, parsedUrl)
      }
    }
  }

  match(url) {
    const parsedUrl = parse(url, true)

    this._loadRoutes()

    const route = this._routes.find(route => route.match(parsedUrl))

    return { route, parsedUrl }
  }

  _loadRoutes() {
    const { to } = require(PATH_TO_ROUTER)

    Object.keys(to).forEach(name => this._defineRoute(name, to[name]))
  }

  _defineRoute(name, routeConfig) {
    const route = new Route({ ...routeConfig, name })

    this._routes.push(route)
  }
}

class Route {
  constructor({ name, path }) {
    this._name = name
    this._path = path
  }

  match(parsedUrl) {
    const { pathname, query } = parsedUrl

    return pathname === this._path
  }

  getComponent() {
    return `/${this._name}`
  }
}

// class Router {
//   constructor(app) {
//     this.app = app
//     this.routes = []
//
//     this.pullRoutes()
//
//     // console.log(this.routes)
//   }
//
//   pullRoutes() {
//     const { to } = require(path.resolve(process.cwd(), 'src', 'router'))
//
//     Object.keys(to).forEach(name => {
//       this.routes.push({
//         key: name,
//         pattern: to[name].pattern,
//         page: to[name].page,
//       })
//     })
//   }
//
//   match(url) {
//     const parsedUrl = parse(url, true)
//     const { pathname, query } = parsedUrl
//     const route = this.routes.find(route => route.pattern === pathname)
//
//     return { route, query }
//   }
//
//   getRequestHandler() {
//     const nextHandler = this.app.getRequestHandler()
//
//     return (req, res) => {
//       const { route, query } = this.match(req.url)
//
//       if (route) {
//         this.app.render(req, res, route.page, query)
//       } else {
//         nextHandler(req, res, req._parsedUrl)
//       }
//     }
//   }
// }

module.exports = Router
