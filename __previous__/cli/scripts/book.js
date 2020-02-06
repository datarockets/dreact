const path = require('path')

module.exports = function(argv) {
  process.argv = process.argv.concat([
    '--config-dir',
    path.resolve(__dirname, '..', 'environment', 'storybook'),
    '--port',
    '4000',
    '--quiet',
    '--ci',
  ])

  if (argv[0] === 'start') {
    return require('@storybook/react/dist/server/index')
  }

  if (argv[0] === 'build') {
    return require('@storybook/react/dist/server/build')
  }
}
