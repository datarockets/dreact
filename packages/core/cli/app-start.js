#!/usr/bin/env node

const path = require('path')
const { startedDevelopmentServer } = require('next/dist/build/output')
const startServer = require('next/dist/server/lib/start-server').default
const loadConfig = require('../lib/loadConfig.js')

const appStart = async () => {
  const port = 3000
  const host = '0.0.0.0'
  const appUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`

  const serverConfig = {
    dir: path.resolve(process.cwd()),
    conf: await loadConfig(),
  }

  startServer(serverConfig, port, host)
    .then(async app => {
      startedDevelopmentServer(appUrl, `${host}:${port}`)

      await app.prepare()
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

module.exports = { appStart }
