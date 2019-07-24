const _ = require('lodash')

const MESSAGE_IMPORT_EACH = 'Import each atom separately'
const MESSAGE_IMPORT_ALL = 'Need to use all atoms but "{{name}}" missed'

const isAtomsFile = filepath => /\/atoms\.js$/.test(filepath)
const isIndexFile = filepath => /\/index\.js$/.test(filepath)
const isIgnored = filepath => /(\.test\.js$|\/__tests__\/.+)/.test(filepath)

const getFileKey = filepath => filepath.replace(/^.+\/src\/(.+)\/[\w.]+$/, '$1')

/* eslint-disable no-underscore-dangle */
class Dependencies {
  constructor() {
    this._map = {}
  }

  _ref(filepath) {
    const key = getFileKey(filepath)

    if (this._map[key]) {
      return this._map[key]
    }

    this._map[key] = {
      defs: [],
      used: [],
      import: null,
      export: null,
    }

    return this._map[key]
  }

  addDefinition(filepath, atom) {
    this._ref(filepath).defs.push(atom)
  }

  addUsage(filepath, name) {
    this._ref(filepath).used.push(name)
  }

  addImportNode(filepath, node) {
    this._ref(filepath).import = node
  }

  addExportNode(filepath, node) {
    this._ref(filepath).export = node
  }

  get(filepath) {
    return this._ref(filepath)
  }
}
/* eslint-enable no-underscore-dangle */

const deps = new Dependencies()

module.exports = {
  create(context) {
    const filepath = context.getFilename()

    return {
      'Program:exit': node => {
        if (isIndexFile(filepath) && !isIgnored(filepath)) {
          const resources = deps.get(filepath)

          const definedButNotUsed = _.differenceWith(
            resources.defs,
            resources.used,
            _.isEqual,
          )

          definedButNotUsed.forEach(variable =>
            context.report({
              node: resources.import || resources.export || node,
              message: MESSAGE_IMPORT_ALL,
              data: { name: variable.name },
            }),
          )
        }
      },

      'ExportNamedDeclaration[exportKind="value"]': node => {
        if (isAtomsFile(filepath) && !isIgnored(filepath)) {
          const name = _.get(node, 'declaration.declarations[0].id.name')

          if (name) {
            deps.addDefinition(filepath, { name })
          } else {
            // eslint-disable-next-line no-console
            console.log('No name', filepath)
          }
        }
      },

      'ImportDeclaration[source.value="./atoms"]': node => {
        if (isIgnored(filepath)) {
          return null
        }

        if (
          node.specifiers.find(
            specifier => specifier.type === 'ImportNamespaceSpecifier',
          )
        ) {
          return context.report({
            node,
            message: MESSAGE_IMPORT_EACH,
          })
        }

        const imports = node.specifiers.map(
          specifier => specifier.imported.name,
        )

        deps.addImportNode(filepath, node)

        return imports.forEach(name => deps.addUsage(filepath, { name }))
      },

      'ExportNamedDeclaration[source.value="./atoms"]': node => {
        if (isIgnored(filepath)) {
          return null
        }

        const exports = node.specifiers.map(specifier => specifier.local.name)

        deps.addExportNode(filepath, node)

        return exports.forEach(name => deps.addUsage(filepath, { name }))
      },
    }
  },
}
