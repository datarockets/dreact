const path = require('path')

// const { default: build } = require('next/dist/build')

const CWD = process.cwd()

// build(path.resolve(CWD, 'src'), require('./overriding/next.config'))
//   .then(() => process.exit(0))
//   .catch(err => {
//     // tslint:disable-next-line
//     console.error('> Build error occurred')
//     console.error(err)
//     process.exit(1)
//   })

const commands = {
  dev: () => require('./overriding/server'),
  build: () => require('next/dist/build'),
}

module.exports = args => {
  const commandName = args[0]
  // const command = commands[commandName]

  switch (commandName) {
    case 'dev': {
      return require('./overriding/server')
    }

    case 'build': {
      const SRC_DIR = path.resolve(CWD, 'src')
      const config = require('./overriding/next.config')

      return require('next/dist/build').default(SRC_DIR, config)
    }

    case 'export': {
      const SRC_DIR = path.resolve(CWD, 'src')
      const config = require('./overriding/next.config')

      const options = {
        silent: false,
        outdir: path.resolve(CWD, '.build'),
      }

      const { PHASE_EXPORT } = require('next/dist/next-server/lib/constants')
      const loadConfig = require('next/dist/next-server/server/config').default

      const nextConfig = loadConfig(PHASE_EXPORT, SRC_DIR, config)

      return require('next/dist/export').default(SRC_DIR, options, nextConfig)
    }

    default:
      console.log('Unknown Command')
  }
}
