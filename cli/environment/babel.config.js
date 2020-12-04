const path = require('path')
const fs = require('fs')

const transformActions = require('./babel/transform-actions')
const accumulateCollections = require('./babel/accumulate-collections')
const aliases = require('./aliases')

const localConfigPath = path.resolve(process.cwd(), 'config/babel.config.js')

module.exports = {
  extends: fs.existsSync(localConfigPath) ? localConfigPath : undefined,

  presets: [
    [
      // We use it here to override `runtime` and to make it work for Jest,
      // and runtime is so because Pug currently can't handle it properly
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'classic',
      },
    ],
  ],

  plugins: [
    transformActions,
    accumulateCollections,

    [
      'module-resolver',
      {
        alias: aliases,
      },
    ],

    'transform-react-pug',

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
