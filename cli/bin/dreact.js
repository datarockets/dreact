#!/usr/bin/env node

const message = require('../utils/message')

const [scriptName, ...argv] = process.argv.slice(2)

require('../utils/pointOurWebpackConfig')

switch (scriptName) {
  case 'app':
    require('../scripts/app')(argv)
    break

  case 'book':
    require('../scripts/book')(argv)
    break

  case 'env-sync':
    require('../scripts/env-sync')(argv)
    break

  case 'lint':
    require('../scripts/lint')(argv)
    break

  case 'test':
    require('../scripts/test')(argv)
    break

  case undefined:
    message('Need to provide a command')
    break

  default:
    message(`There is no defined script for "${scriptName}"`)
}
