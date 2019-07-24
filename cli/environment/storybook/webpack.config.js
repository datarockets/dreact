const path = require('path')

module.exports = ({ config }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    'process.cwd': path.resolve(process.cwd()),
  }

  config.module.rules.push({
    test: /\/book\.js$/,
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: {
          prettierConfig: {
            // Turn off prettier
            requirePragma: true,
          },
        },
      },
    ],
    enforce: 'pre',
  })

  return config
}
