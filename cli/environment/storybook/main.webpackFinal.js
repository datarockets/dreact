const path = require('path')

const CWD = process.cwd()

const getClientDependency = module => path.resolve(CWD, 'node_modules', module)

function addAliases(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'process.cwd': path.resolve(CWD),
    react: getClientDependency('react'),
    'react-dom': getClientDependency('react-dom'),
    'react-router-dom': getClientDependency('react-router-dom'),
    'styled-components': getClientDependency('styled-components'),
  }
}

function addSourceLoader(config) {
  config.module.rules.push({
    test: /\/book\.js$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: {
          prettierConfig: {
            requirePragma: true, // Turn off prettier
          },
        },
      },
    ],
    enforce: 'pre',
  })
}

function addCustomBabelConfig(config) {
  config.module.rules[2].oneOf[2].options.extends = path.resolve(
    __dirname,
    '.babelrc',
  )
  delete config.module.rules[2].oneOf[2].options.presets
}

function allowImportingBookSetupItem(config) {
  const pathBookSetupItem = path.resolve(CWD, 'config', 'book.setup-item.js')

  config.resolve.plugins[1].allowedFiles.add(pathBookSetupItem)

  config.module.rules[2].oneOf[2].include.push(pathBookSetupItem)
}

function removeEslintBeforeBuilding(config) {
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ESLintWebpackPlugin',
  )
}

module.exports = config => {
  addAliases(config)
  addSourceLoader(config)
  addCustomBabelConfig(config)
  allowImportingBookSetupItem(config)
  removeEslintBeforeBuilding(config)

  return config
}
