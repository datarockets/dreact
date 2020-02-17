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

const handle = app.getRequestHandler()

const router = new Router(app)

console.log('> Initialize App')
app.prepare().then(() => {
  const server = express()

  server.use(router.getRequestHandler())

  server.listen(3000, error => {
    if (error) throw error
    console.log('> Ready on http://localhost:3000')
  })
})
