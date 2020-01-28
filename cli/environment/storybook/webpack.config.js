const path = require('path')

const CWD = process.cwd()

const getClientDependency = module => path.resolve(CWD, 'node_modules', module)

function addAliases(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'process.cwd': path.resolve(CWD),
    react: getClientDependency('react'),
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

function allowImportingBookSetupItem(config) {
  const pathBookSetupItem = path.resolve(CWD, 'config', 'book.setup-item.js')

  config.resolve.plugins[1].allowedFiles.add(pathBookSetupItem)

  config.module.rules[3].oneOf[1].include.push(pathBookSetupItem)
}

function removePreLinting(config) {
  config.module.rules.splice(2, 1)
}

module.exports = ({ config }) => {
  addAliases(config)
  addSourceLoader(config)
  allowImportingBookSetupItem(config)
  removePreLinting(config)

  return config
}
