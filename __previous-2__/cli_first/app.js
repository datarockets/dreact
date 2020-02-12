const path = require('path')
const fs = require('fs')
const aliasManager = require('module-alias')

const commands = {
  dev: () => require('next/dist/cli/next-dev').nextDev,
}

module.exports = argv => {
  const command = argv[0]
  const forwardArgs = argv.slice(1)

  aliasManager.addAliases({
    react: path.resolve(process.cwd(), 'node_modules', 'react'),
    'react-dom': path.resolve(process.cwd(), 'node_modules', 'react-dom'),
  })

  overrideNextConfig()

  switch (command) {
    case 'dev': {
      commands.dev()(forwardArgs)
    }
  }
}

function overrideNextConfig() {
  const NEW_CONFIG_FILE = path.resolve(
    __dirname,
    'overriding',
    'next.config.js',
  )

  const REQUESTED_CONFIG_FILE = path.resolve(process.cwd(), 'next.config.js')

  const fsStatSync = fs.statSync.bind(fs)
  fs.statSync = (...args) => {
    if (args[0] === REQUESTED_CONFIG_FILE) {
      return fsStatSync(NEW_CONFIG_FILE)
    }

    return fsStatSync(...args)
  }

  aliasManager.addAlias(REQUESTED_CONFIG_FILE, NEW_CONFIG_FILE)
}
