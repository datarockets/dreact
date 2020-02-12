const path = require('path')
const { parse } = require('url')

class Router {
  constructor(app) {
    this.app = app
    this.routes = []

    this.pullRoutes()

    console.log(this.routes)
  }

  pullRoutes() {
    const { to } = require(path.resolve(process.cwd(), 'src', 'router'))

    Object.keys(to).forEach(name => {
      this.routes.push({
        key: name,
        pattern: to[name].pattern,
        page: to[name].page,
      })
    })
  }

  match(url) {
    const parsedUrl = parse(url, true)
    const { pathname, query } = parsedUrl
    const route = this.routes.find(route => route.pattern === pathname)

    return { route, query }
  }

  getRequestHandler() {
    const nextHandler = this.app.getRequestHandler()

    return (req, res) => {
      const { route, query } = this.match(req.url)

      if (route) {
        this.app.render(req, res, route.page, query)
      } else {
        nextHandler(req, res, req._parsedUrl)
      }
    }
  }
}

module.exports = Router
