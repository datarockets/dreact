const path = require('path')
const buildGeneralConfig = require('react-scripts/config/webpack.config')

module.exports = (...args) => {
  const config = buildGeneralConfig(...args)

  // Add custom babel config
  config.module.rules[2].oneOf[1].options.extends = path.resolve(
    __dirname,
    'babel.config.js',
  )
  delete config.module.rules[2].oneOf[1].options.presets

  // Remove eslint before building
  config.module.rules.splice(1, 1)

  return config
}
