const { Minimatch } = require('minimatch')

const isCollectionItems = new Minimatch(
  '**/src/collections/*/{api,actions,use}.js',
)

const isIncluded = path => isCollectionItems.match(path)

module.exports = {
  create(context) {
    const filepath = context.getFilename()

    return {
      ExportDefaultDeclaration(node) {
        if (isIncluded(filepath)) {
          context.report({
            node,
            message: 'Use named exports for this file',
          })
        }
      },
    }
  },
}
