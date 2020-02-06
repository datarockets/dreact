const path = require('path')

const _ = require('lodash')

const babelConfigPath = path.resolve(__dirname, '..', 'babel.config.js')

// eslint-disable-next-line import/no-dynamic-require
const babelConfig = require(babelConfigPath)

function normalizeAliases(aliases) {
  return _.mapValues(aliases, (value, key) => {
    let nextValue = value

    _.forIn(aliases, (innerValue, innerKey) => {
      if (key !== innerKey) {
        nextValue = value.replace(innerValue, innerKey)
      }
    })

    return nextValue
  })
}

const babelAliases = normalizeAliases(
  babelConfig.plugins.find(item => item[0] === 'module-resolver')[1].alias,
)

module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        const name = node.source.value

        _.forIn(babelAliases, (value, key) => {
          if (name.indexOf(value) === 0) {
            const aliasedPath = `${key}${name.replace(value, '')}`

            context.report({
              node: node.source,
              message: `Supposed to use alias "${aliasedPath}"`,
              fix(fixer) {
                return fixer.replaceText(node.source, `'${aliasedPath}'`)
              },
            })
          }
        })
      },
    }
  },
}
