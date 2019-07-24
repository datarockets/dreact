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

module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: [
    'stylelint-config-datarockets',
    'stylelint-config-styled-components',
  ],
  rules: {
    indentation: 2,
  },
  syntax: 'scss',
}
