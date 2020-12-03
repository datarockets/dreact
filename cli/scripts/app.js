module.exports = function (argv) {
  process.env.SKIP_PREFLIGHT_CHECK = true
  process.env.BROWSER = 'none'

  // Because Pug is not compatible with new jsx transform
  process.env.DISABLE_NEW_JSX_TRANSFORM = true

  if (argv[0] === 'start') {
    return require('react-scripts/scripts/start')
  }

  if (argv[0] === 'build') {
    return require('react-scripts/scripts/build')
  }
}
