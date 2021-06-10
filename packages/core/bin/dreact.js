#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

const args = process.argv.slice(2)

const [category, command] = args

console.debug('> [dreact]', args.join(' '))

if (category === 'app' && command === 'dev') {
  require('../cli/app-dev.js').appDev()
} else if (category === 'app' && command === 'build') {
  require('../cli/app-build.js').appBuild()
} else if (category === 'app' && command === 'export') {
  require('../cli/app-export.js').appExport()
} else if (category === 'app' && command === 'start') {
  require('../cli/app-start.js').appStart()
} else if (category === 'spa' && command === 'dev') {
  require('../cli/spa-dev.js').spaDev()
} else {
  console.error(`Unknown arguments: ${args.join(' ')}`)
  process.exit(1)
}

// Subscribe to config changes to offer app restart
// https://github.com/vercel/next.js/blob/2743a74b62a4d4b3e9b935a37e077b9cdb9574fa/packages/next/bin/next.ts#L119-L129
