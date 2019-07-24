const path = require('path')
const aliasManager = require('module-alias')

const pathToWebpackConfigInReactScripts = '../config/webpack.config'

const pathToWebpackConfigInStorybook = path.resolve(
  process.cwd(),
  'node_modules',
  'react-scripts',
  'config',
  'webpack.config.js',
)

const pathToOurWebpackConfig = path.resolve(
  __dirname,
  '..',
  'environment',
  'webpack.config.js',
)

aliasManager.addAliases({
  [pathToWebpackConfigInReactScripts]: pathToOurWebpackConfig,
  [pathToWebpackConfigInStorybook]: pathToOurWebpackConfig,
})
