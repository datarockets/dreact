#!/usr/bin/env node

const path = require('path')
const { printAndExit } = require('next/dist/server/lib/utils')
const exportApp = require('next/dist/export').default
const loadConfig = require('../lib/loadConfig.js')
const { OUTPUT_DIR_NAME } = require('../lib/constants')
const { PHASE_EXPORT } = require('next/dist/next-server/lib/constants')
const loadNextConfig = require('next/dist/next-server/server/config').default

const appExport = async () => {
  const dir = path.resolve(process.cwd())

  const localConfig = await loadConfig()
  const conf = await loadNextConfig(PHASE_EXPORT, dir, localConfig)

  const options = {
    outdir: path.resolve(process.cwd(), OUTPUT_DIR_NAME),
  }
  conf.useFileSystemPublicRoutes = false
  // Instead we want to expose a single file that will include all other pages
  conf.exportPathMap = async () => ({
    '/': { page: '/_app' },
  })

  exportApp(dir, options, conf)
    .then(() => {
      printAndExit(`Export successful. Files written to ${options.outdir}`, 0)
    })
    .catch(err => {
      printAndExit(err)
    })
}

module.exports = { appExport }
