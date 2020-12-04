const webpackFinal = require('./main.webpackFinal')

module.exports = {
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-knobs/register',
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
  ],

  // We need to point to correct file with babel config when we
  // configure webpack, so it's more convenient for us to setup
  // everything related to babel in one place -- in .babelrc
  // babel: options => ({ ...options }),

  webpackFinal,
}
