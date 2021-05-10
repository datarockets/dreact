const path = require('path')
const fs = require('fs')
const jest = require('jest')

module.exports = function (argv) {
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

  const setupTestsFiles = [
    '<rootDir>/node_modules/dreact/cli/environment/jest/setup.js',
  ]

  if (fs.existsSync(resolveApp('config/jest.setup.js'))) {
    setupTestsFiles.push('<rootDir>/config/jest.setup.js')
  }

  const config = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    setupFiles: [require.resolve('react-app-polyfill/jsdom')],
    setupFilesAfterEnv: setupTestsFiles,
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jest-environment-jsdom-fourteen',
    testRunner: require.resolve('jest-circus/runner'),
    transform: {
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve(
        'dreact/cli/environment/jest/babelTransform.js',
      ),
      '^.+\\.css$': require.resolve(
        'react-scripts/config/jest/cssTransform.js',
      ),
      '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': require.resolve(
        'react-scripts/config/jest/fileTransform.js',
      ),
    },
    transformIgnorePatterns: [
      '\\/node_modules\\/(?!dreact\\/).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    modulePaths: [],
    moduleNameMapper: {
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
      '^src\\/(.*)$': '<rootDir>/src/$1',
      '^dreact\\/(.*)$': '<rootDir>/node_modules/dreact/$1',
      '^react$': '<rootDir>/node_modules/react',

      // To avoid multiple nested enzymes, which come with other packages
      '^enzyme$': '<rootDir>/node_modules/enzyme',
      '^enzyme-adapter-react-16$':
        '<rootDir>/node_modules/enzyme-adapter-react-16',
    },
    moduleFileExtensions: ['web.js', 'js', 'jsx', 'json', 'node', 'ts', 'tsx'],
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
    resetMocks: true,
  }

  argv.push('--config', JSON.stringify(config))

  jest.run(argv)
}
