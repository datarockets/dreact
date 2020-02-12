#!/usr/bin/env node

const message = content => console.log(`\n    ${content}\n  `)

const [scriptName, ...argv] = process.argv.slice(2)

switch (scriptName) {
  case 'app':
    return require('../cli/app')(argv)

  case undefined:
    message('Need to provide a command')
    break

  default:
    message(`There is no defined script for "${scriptName}"`)
}
