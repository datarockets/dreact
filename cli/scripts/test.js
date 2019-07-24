const path = require('path')
const fs = require('fs')
const jest = require('jest')

module.exports = function(argv) {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test'
  process.env.NODE_ENV = 'test'
  process.env.PUBLIC_URL = ''

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on('unhandledRejection', err => {
    throw err
  })

  // Load project-related environment variables
  require('react-scripts/config/env')

  argv.push('--env=jsdom')
  argv.push('--colors')

  if (!process.env.CI && argv.indexOf('--coverage') < 0) {
    argv.push('--watch')
  }

  const appDirectory = fs.realpathSync(process.cwd())
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

  const setupTestsFile = fs.existsSync(resolveApp('config/jest.setup.js'))
    ? ['<rootDir>/config/jest.setup.js']
    : []

  const config = {
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    setupFiles: [require.resolve('react-app-polyfill/jsdom')],
    setupFilesAfterEnv: setupTestsFile,
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jest-environment-jsdom-fourteen',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$':
        '<rootDir>/node_modules/dreact-cli/environment/jest/babelTransform.js',
      '^.+\\.css$':
        '<rootDir>/node_modules/react-scripts/config/jest/cssTransform.js',
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
        '<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    modulePaths: [],
    moduleNameMapper: {
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: ['web.js', 'js', 'json', 'node'],
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
  }

  argv.push('--config', JSON.stringify(config))

  jest.run(argv)
}
