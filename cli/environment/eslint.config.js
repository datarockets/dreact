const fs = require('fs')
const path = require('path')
const _ = require('lodash')

;(function registerLocalPlugin(Module) {
  const options = {
    paths: [
      ...require.resolve.paths(__dirname),
      path.resolve(process.cwd(), 'node_modules'),
    ],
  }

  if (!global.isModulePatchedForEslint) {
    global.isModulePatchedForEslint = true
    global.originalModuleFindPath = Module._findPath

    Module._findPath = (request, paths, isPatched = false) => {
      if (request === 'eslint-plugin-local') {
        return require.resolve('./eslint-plugin-local')
      }

      if (
        !isPatched &&
        request.indexOf('eslint') > -1 &&
        !request.startsWith('.')
      ) {
        return global.originalModuleFindPath(
          request,
          options.paths.concat(paths),
          true,
        )
      }

      return global.originalModuleFindPath(request, paths)
    }
  }
})(require('module'))

const aliases = require('./aliases')

const pathToPrettier = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  'prettier',
)

const pathToLocalConfig = path.resolve(
  process.cwd(),
  'config',
  'eslint.config.js',
)

const internalConfig = {
  plugins: ['react-pug', 'local', 'import-helpers'],
  extends: [
    'datarockets',
    'plugin:react-pug/all',
    fs.existsSync(pathToPrettier) && 'prettier',
  ].filter(Boolean),
  globals: {
    React: true,
    styled: true,

    // Transformed by Babel
    Action: true,
  },
  rules: {
    'local/collection-named-exports': 'error',
    'local/component-function': 'error',
    'local/component-names': 'error',
    'local/have-tests': 'error',
    'local/require-aliases': 'error',
    'local/use-atoms': 'error',

    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: [
          '/^(assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|trace_events|tty|url|util|v8|vm|zli)/',
          '/^((?!src|UI|Icons)\\w[\\w-\\./]+|@.+)$/',
          '/^src\\/pages\\/.+$/',
          '/^src\\/(?!services|collections|containers|components|forms|lib)[\\w-/]+$/',
          '/^src\\/services(\\/.+)?/',
          '/^src\\/collections(\\/.+)?/',
          '/^src\\/containers\\/.+/',
          '/^src\\/components\\/.+/',
          '/^src\\/forms\\/.+/',
          '/^UI\\/[a-z].+/',
          '/^UI\\/[A-Z].+/',
          '/^Icons\\/.+/',
          '/^src\\/lib\\/.+/',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],

    'react-pug/prop-types': 'error',

    'react-pug/pug-lint': [
      'error',
      {
        disallowClassLiteralsBeforeIdLiterals: true,
        disallowHtmlText: true,
        disallowTrailingSpaces: true,
        requireClassLiteralsBeforeAttributes: true,
        requireIdLiteralsBeforeAttributes: true,
        requireSpaceAfterCodeOperator: true,
        requireStrictEqualityOperators: true,
        validateAttributeQuoteMarks: '"',
        validateIndentation: 2,
      },
    ],

    'react-pug/eslint': [
      'error',
      {
        /* eslint-disable global-require, import/no-extraneous-dependencies */
        ...require('eslint-config-airbnb-base/rules/best-practices').rules,
        ...require('eslint-config-airbnb-base/rules/errors').rules,
        ...require('eslint-config-airbnb-base/rules/es6').rules,
        ...require('eslint-config-airbnb-base/rules/style').rules,
        ...require('eslint-config-datarockets-base').rules,
        /* eslint-enable */
      },
    ],

    // Turned off because we want different style-guide
    'prefer-destructuring': 'off',

    // Turned off temporary because of pugjs
    'react/prop-types': 'off',
    'react/no-unused-prop-types': 'off',
    'react/no-unused-state': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: aliases,
      },
    },
  },
  reportUnusedDisableDirectives: true,
}

module.exports = _.merge(
  internalConfig,
  fs.existsSync(pathToLocalConfig) && require(pathToLocalConfig),
)
