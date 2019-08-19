const { Minimatch } = require('minimatch')

const isIgnored = new Minimatch(
  '**/src/{components/UI/**,**/__tests__/**,**/assets/**,**/*.test.js,**/!(index.js)}',
)

const isUiComponent = new Minimatch('**/src/UI/**')
const isPageComponent = new Minimatch('**/src/pages/**')
const isFormComponent = new Minimatch('**/src/forms/**')
const isContainerComponent = new Minimatch('**/src/containers/**')
const isBasicComponent = new Minimatch('**/src/components/**')

const isPotentialComponent = filepath =>
  !isIgnored.match(filepath) &&
  (isUiComponent.match(filepath) ||
    isPageComponent.match(filepath) ||
    isFormComponent.match(filepath) ||
    isContainerComponent.match(filepath) ||
    isBasicComponent.match(filepath))

function getExpectedName(filepath) {
  if (isUiComponent.match(filepath)) {
    return filepath
      .replace(/^.+\/src\/(UI\/.+)\/[\w.]+\.js/, '$1')
      .replace(/\//g, '')
  }

  if (isPageComponent.match(filepath)) {
    return `Page${filepath
      .replace(/^.+\/src\/pages\/([\w.]+)(\/index\.js|\.js)/, '$1')
      .replace(/\//g, '')}`
  }

  if (isFormComponent.match(filepath)) {
    return `Form${filepath
      .replace(/^.+\/src\/forms\/(.+)\/\w+\.js/, '$1')
      .replace(/\//g, '')}`
  }

  if (isContainerComponent.match(filepath)) {
    return `Container${filepath
      .replace(/^.+\/src\/containers((?:\/[A-Z][A-z]*)+).+$/, '$1')
      .replace(/\//g, '')}`
  }

  if (isBasicComponent.match(filepath)) {
    return filepath
      .replace(/^.+\/src\/components\/(.+)\/\w+\.js/, '$1')
      .replace(/\//g, '')
  }

  return filepath.replace(/^.+\/src\/(.+)\.js$/, '$1')
}

function isComponentIdentifier(token) {
  return token.type === 'Identifier' && /^[A-Z][A-z0-9]+$/.test(token.value)
}

module.exports = {
  create(context) {
    const filepath = context.getFilename()
    const sourceCode = context.getSourceCode()

    let exportedIdentifiers = []
    let exportIdentifier = null

    function findUsage(identifiers, target) {
      // If the target mentioned in default export node, then we consider
      // the target as used
      if (identifiers.some(item => item.value === target)) {
        return true
      }

      // Otherwise, we find where every identifier was defined (as
      // VariableDeclarator) and then try to find usage of target in definitions
      return identifiers.some(tokenInExport => {
        const defs = sourceCode.getTokensBefore(tokenInExport, {
          filter: item =>
            item.type === 'Identifier' && item.value === tokenInExport.value,
        })

        return defs.some(def => {
          const parentNode = sourceCode.getNodeByRangeIndex(def.start).parent

          if (parentNode.type === 'VariableDeclarator') {
            const identifiersInDef = sourceCode
              .getTokensBetween(def, tokenInExport)
              .filter(isComponentIdentifier)

            return findUsage(identifiersInDef, target)
          }

          if (
            parentNode.type === 'MemberExpression' &&
            parentNode.parent.type === 'AssignmentExpression'
          ) {
            if (
              parentNode.object.name === def.value &&
              parentNode.property.name === 'displayName'
            ) {
              exportedIdentifiers = [
                {
                  value: parentNode.parent.right.value,
                  loc: parentNode.parent.right.loc,
                },
              ]

              return parentNode.parent.right.value === target
            }
          }

          return false
        })
      })
    }

    return {
      ExportDefaultDeclaration(node) {
        if (isPotentialComponent(filepath)) {
          const identifiers = sourceCode.getFirstTokens(node, {
            filter: isComponentIdentifier,
          })

          if (identifiers.length > 0) {
            exportedIdentifiers = identifiers
            exportIdentifier = node.declaration
          }
        }
      },

      'Program:exit': function programExit() {
        if (isPotentialComponent(filepath)) {
          const expectedName = getExpectedName(filepath)

          if (exportedIdentifiers.length === 0) {
            // eslint-disable-next-line no-console
            console.warn(`* Could not recognize name for ${expectedName}`)
          }

          if (exportedIdentifiers.length > 0) {
            if (!findUsage(exportedIdentifiers, expectedName)) {
              let message = `Expected '${expectedName}' name`
              let loc = exportIdentifier.loc

              if (exportedIdentifiers.length === 1) {
                message += ` but got ${exportedIdentifiers[0].value}`
                loc = exportedIdentifiers[0].loc
              }

              context.report({
                node: exportIdentifier,
                loc,
                message,
              })
            }
          }
        }
      },
    }
  },
}
