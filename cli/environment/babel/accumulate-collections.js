const fs = require('fs')
const path = require('path')

const COLLECTIONS_DIR = path.resolve(process.cwd(), 'src', 'collections')

const FILENAME_REDUCER = 'reducer.js'
const FILENAME_SAGA = 'saga.js'

const PROPERTY_NAME_REDUCERS = 'reducers'
const PROPERTY_NAME_SAGAS = 'sagas'

module.exports = function babelPluginAccumulateCollections({ types: t }) {
  const getRelative = absolute =>
    `./${path.relative(COLLECTIONS_DIR, absolute)}`

  function buildRequireFor(source) {
    return t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(source)]),
      t.identifier('default'),
    )
  }

  function getReducersAndSagas() {
    const sagas = []
    const reducers = {}

    fs.readdirSync(COLLECTIONS_DIR, { withFileTypes: true }).forEach(item => {
      if (!item.isDirectory()) {
        return false
      }

      const reducerPath = path.resolve(
        COLLECTIONS_DIR,
        item.name,
        FILENAME_REDUCER,
      )
      const sagaPath = path.resolve(COLLECTIONS_DIR, item.name, FILENAME_SAGA)

      if (fs.existsSync(reducerPath)) {
        reducers[item.name.toLowerCase()] = buildRequireFor(
          getRelative(reducerPath),
        )
      }

      if (fs.existsSync(sagaPath)) {
        sagas.push(buildRequireFor(getRelative(sagaPath)))
      }

      return null
    })

    return {
      sagas,
      reducers,
    }
  }

  function injectProperty(params, reference, value) {
    const existedProperty = params.get('properties').find(property => {
      const key = property.node.key.name || property.node.key.value
      return key === reference
    })

    if (existedProperty) {
      const currentValue = existedProperty.get('value')

      if (currentValue.isObjectExpression()) {
        currentValue.replaceWith(
          t.objectExpression([...currentValue.node.properties, ...value]),
        )
      } else if (currentValue.isArrayExpression()) {
        currentValue.replaceWith(
          t.arrayExpression([...currentValue.node.elements, ...value]),
        )
      }
    } else {
      if (params.isObjectExpression()) {
        params.replaceWith(t.objectExpression(value))
      } else if (params.isArrayExpression()) {
        params.replaceWith(t.arrayExpression(value))
      }
    }
  }

  return {
    name: 'babel-plugin-accumulate-collections',
    visitor: {
      CallExpression(nodePath) {
        if (nodePath.get('callee').node.name === 'makeStoreConfigurer') {
          const params = nodePath.get('arguments')[0]

          const { sagas, reducers } = getReducersAndSagas()

          const reducersMap = Object.keys(reducers).map(key =>
            t.objectProperty(t.identifier(key), reducers[key]),
          )

          injectProperty(params, PROPERTY_NAME_SAGAS, sagas)
          injectProperty(params, PROPERTY_NAME_REDUCERS, reducersMap)
        }
      },
    },
  }
}
