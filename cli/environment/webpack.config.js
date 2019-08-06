const path = require('path')
const buildGeneralConfig = require('react-scripts/config/webpack.config')

const getCacheIdentifier = require('./webpack/getCacheIdentifier')

const getClientDependency = module =>
  path.resolve(process.cwd(), 'node_modules', module)

const getInternalDependency = module =>
  path.resolve(__dirname, '..', '..', 'node_modules', module)

module.exports = (...args) => {
  const config = buildGeneralConfig(...args)

  // Add custom babel config
  config.module.rules[2].oneOf[1].options.extends = path.resolve(
    __dirname,
    'babel.config.js',
  )
  delete config.module.rules[2].oneOf[1].options.presets

  // Boost cache when files in src/collections/changed
  config.module.rules[2].oneOf[1].options.cacheIdentifier += ':'
  config.module.rules[2].oneOf[1].options.cacheIdentifier += getCacheIdentifier()

  // Remove eslint before building
  config.module.rules.splice(1, 1)

  // Make sure we resolve react dependency properly
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      react: getClientDependency('react'),
    },
  }

  return config
}
