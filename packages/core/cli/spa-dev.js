#!/usr/bin/env node

const path = require('path')
const { startedDevelopmentServer } = require('next/dist/build/output')
const startServer = require('next/dist/server/lib/start-server').default
const loadConfig = require('../lib/loadConfig.js')
const { PAGE_SPA_ROUTER } = require('../lib/constants')

const spaDev = async () => {
  const port = 3000
  const host = '0.0.0.0'
  const appUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`

  const serverConfig = {
    dir: path.resolve(process.cwd()),
    dev: true,
    isNextDevCommand: true,
    conf: await loadConfig(),
  }

  // For SPA we should keep all the pages on place to make them built correctly,
  // but we don't want them to be exposed
  // serverConfig.conf.useFileSystemPublicRoutes = false
  // Instead we want to expose a single file that will include all other pages
  // serverConfig.conf.exportPathMap = async () => ({
  //   '/': { page: '/_router' },
  // })

  // serverConfig.conf.rewrites = () => [
  //   {
  //     source: '/:path*',
  //     destination: '/',
  //   },
  // ]

  // serverConfig.conf.rewrites = () => ({
  //   beforeFiles: [
  //     {
  //       source: '/:path*',
  //       destination: '/',
  //     },
  //   ],
  // })

  startServer(serverConfig, port, host)
    .then(async app => {
      startedDevelopmentServer(appUrl, `${host}:${port}`)

      await app.prepare()
    })
    .catch(err => {
      console.error(err)
      process.nextTick(() => process.exit(1))
    })
}

module.exports = { spaDev }
