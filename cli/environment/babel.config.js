const path = require('path')
const fs = require('fs')

const transformActions = require('./babel/transform-actions')
const aliases = require('./aliases')

const localConfigPath = path.resolve(process.cwd(), 'config/babel.config.js')

module.exports = {
  extends: fs.existsSync(localConfigPath) ? localConfigPath : undefined,

  presets: ['babel-preset-react-app'],

  plugins: [
    transformActions,

    [
      'module-resolver',
      {
        alias: aliases,
      },
    ],

    'transform-react-pug',

    'transform-jsx-classname-components',

    'react-require', // should go after `transform-react-pug`

    'styled-components-require',
    'styled-components', // should go after `styled-components-require`
  ],

  env: {
    production: {
      plugins: [['jsx-remove-data-test-id', { attributes: 'TESTID' }]],
    },
    development: {
      plugins: [['jsx-remove-data-test-id', { attributes: 'TESTID' }]],
    },
  },
}
