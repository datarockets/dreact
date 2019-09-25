const path = require('path')
const webpack = require('webpack')
const buildGeneralConfig = require('react-scripts/config/webpack.config')

const getCacheIdentifier = require('./webpack/getCacheIdentifier')

const getClientDependency = module =>
  path.resolve(process.cwd(), 'node_modules', module)

function addCustomEntryPoint(config) {
  config.entry = config.entry.map(item => {
    if (item.endsWith('/src/index.js')) {
      return path.resolve(
        process.cwd(),
        'node_modules',
        'dreact',
        'cli',
        'environment',
        'webpack',
        'entry.js',
      )
    }

    return item
  })

  config.plugins.push(
    new webpack.DefinePlugin({
      __PROJECT_ENTRY_PATH: `"${path.resolve(
        process.cwd(),
        'src',
        'index.js',
      )}"`,
    }),
  )
}

function addCustomBabelConfig(config) {
  config.module.rules[2].oneOf[1].options.extends = path.resolve(
    __dirname,
    'babel.config.js',
  )
  delete config.module.rules[2].oneOf[1].options.presets
}

function addCacheBoosterWhenCollectionsChanged(config) {
  config.module.rules[2].oneOf[1].options.cacheIdentifier += ':'
  config.module.rules[2].oneOf[1].options.cacheIdentifier += getCacheIdentifier()
}

function removeEslintBeforeBuilding(config) {
  config.module.rules.splice(1, 1)
}

function enhanceDependencyResolver(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      react: getClientDependency('react'),
    },
  }
}

module.exports = (...args) => {
  const config = buildGeneralConfig(...args)

  addCustomEntryPoint(config)
  addCustomBabelConfig(config)
  addCacheBoosterWhenCollectionsChanged(config)
  removeEslintBeforeBuilding(config)
  enhanceDependencyResolver(config)

  return config
}
