const express = require('express')
const next = require('next')
const { parse } = require('url')
const Router = require('./Router')

const DEV = process.env.NODE_ENV !== 'production'

const app = next({
  dev: DEV,
  dir: 'src',
  conf: require('./next.config'),
})

console.log(app)

const handle = app.getRequestHandler()

// const Router = {
//   getRequestHandler(app) {
//     return (req, res) => {
//       console.log(req._parsedUrl)
//       console.log(req.params)
//       console.log(req.query)
//       app.getRequestHandler()(req, res, req._parsedUrl)
//     }
//   },
// }

const router = new Router(app)

app.prepare().then(() => {
  const server = express()

  server.use(router.getRequestHandler())

  server.listen(3000, error => {
    if (error) throw error
    console.log('> Ready on http://localhost:3000')
  })
})
