const path = require('path')
const webpack = require('webpack')
const buildGeneralConfig = require('react-scripts/config/webpack.config')

const getCacheIdentifier = require('./webpack/getCacheIdentifier')

const getClientDependency = module =>
  path.resolve(process.cwd(), 'node_modules', module, 'index.js')

function addCustomEntryPoint(config) {
  const pathToOurEntryPoint = path.resolve(
    process.cwd(),
    'node_modules',
    'dreact',
    'cli',
    'environment',
    'webpack',
    'entry.js',
  )

  config.entry = Array.isArray(config.entry)
    ? config.entry.map(item => {
        if (item.endsWith('/src/index.js')) {
          return pathToOurEntryPoint
        }

        return item
      })
    : pathToOurEntryPoint

  config.plugins.push(
    new webpack.DefinePlugin({
      __PROJECT_ENTRY_PATH: `"${path.resolve(process.cwd(), 'src', 'index')}"`,
    }),
  )
}

function addCustomBabelConfig(config) {
  config.module.rules[1].oneOf[3].options.extends = path.resolve(
    __dirname,
    'babel.config.js',
  )
}

function addCacheBoosterWhenCollectionsChanged(config) {
  config.module.rules[1].oneOf[3].options.cacheIdentifier += ':'
  config.module.rules[1].oneOf[3].options.cacheIdentifier +=
    getCacheIdentifier()
}

function enhanceDependencyResolver(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      react: getClientDependency('react'),
      'react-dom': getClientDependency('react-dom'),
      'react-router-dom': getClientDependency('react-router-dom'),
      'styled-components': getClientDependency('styled-components'),
    },
  }
}

function removeEslintBeforeBuilding(config) {
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ESLintWebpackPlugin',
  )
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
