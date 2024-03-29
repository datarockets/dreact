const fs = require('fs')
const path = require('path')
const _ = require('lodash')

;(function registerLocalPlugin(Module) {
  const options = {
    paths: require.resolve.paths(__dirname),
  }

  if (!global.isModulePatchedForEslint) {
    global.isModulePatchedForEslint = true
    global.originalModuleFindPath = Module._findPath

    Module._findPath = (request, paths, isPatched = false) => {
      if (
        !isPatched &&
        request.indexOf('stylelint') > -1 &&
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

const pathToPrettier = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  'prettier',
)

const pathToLocalConfig = path.resolve(
  process.cwd(),
  'config',
  'stylelint.config.js',
)

const internalConfig = {
  processors: ['stylelint-processor-styled-components'],
  extends: [
    'stylelint-config-datarockets',
    'stylelint-config-styled-components',
    fs.existsSync(pathToPrettier) && 'stylelint-config-prettier',
  ].filter(Boolean),
  rules: {
    indentation: fs.existsSync(pathToPrettier) ? null : 2,
  },
  syntax: 'scss',
}

module.exports = _.merge(
  internalConfig,
  fs.existsSync(pathToLocalConfig) && require(pathToLocalConfig),
)
