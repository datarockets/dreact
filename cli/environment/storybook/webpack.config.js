const path = require('path')

const getClientDependency = module =>
  path.resolve(process.cwd(), 'node_modules', module)

module.exports = ({ config }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    'process.cwd': path.resolve(process.cwd()),
    react: getClientDependency('react'),
    'react-router-dom': getClientDependency('react-router-dom'),
    'styled-components': getClientDependency('styled-components'),
  }

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

  return config
}
