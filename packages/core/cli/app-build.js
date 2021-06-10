#!/usr/bin/env node

const path = require('path')
const { printAndExit } = require('next/dist/server/lib/utils')
const build = require('next/dist/build').default
const loadConfig = require('../lib/loadConfig.js')

const appBuild = async () => {
  const dir = path.resolve(process.cwd())
  const conf = await loadConfig()
  const reactProductionProfiling = false
  const debugOutput = false

  build(dir, conf, reactProductionProfiling, debugOutput).catch(err => {
    console.error('')
    console.error('> Build error occurred')
    printAndExit(err)
  })
}

module.exports = { appBuild }
