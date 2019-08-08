const IMPORT_SOURCE = 'dreact/helper-actions'
const REFERENCE = 'createAction'
const RE_COLLECTION_ACTIONS_FILE = /^.*src\/collections\/(\w+)\/actions.js$/

module.exports = function babelPluginTransformActions({ types: t }) {
  const hasReference = path => path.scope.hasBinding(REFERENCE)

  const needImportDecl = state => state.file.get('needImportDeclaration')

  const isCollectionActionsFile = state =>
    (state.filename || '').match(RE_COLLECTION_ACTIONS_FILE)

  return {
    name: 'babel-plugin-transform-actions',
    visitor: {
      Program: {
        exit(path, state) {
          // Stop processing when inside not actions file
          if (!isCollectionActionsFile(state)) {
            return
          }

          if (!hasReference(path) && needImportDecl(state)) {
            const importDeclaration = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(REFERENCE))],
              t.stringLiteral(IMPORT_SOURCE),
            )

            path.unshiftContainer('body', importDeclaration)
          }
        },
      },

      NewExpression(path, state) {
        // Stop processing when inside not actions file
        if (!isCollectionActionsFile(state)) {
          return
        }

        if (
          path.node.callee.name === 'Action' &&
          path.parentPath.type === 'VariableDeclarator'
        ) {
          const collectionName = state.filename.replace(
            RE_COLLECTION_ACTIONS_FILE,
            '$1',
          )
          const actionName = path.parentPath.node.id.name
          const next = t.callExpression(t.identifier(REFERENCE), [
            t.stringLiteral(`${collectionName}/${actionName}`),
            ...path.node.arguments,
          ])

          path.replaceWith(next)
          state.file.set('needImportDeclaration', true)
        }
      },
    },
  }
}
