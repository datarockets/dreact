const fs = require('fs')
const path = require('path')

const COLLECTIONS_DIR = path.resolve(process.cwd(), 'src', 'collections')

const FILENAME_REDUCER = 'reducer.js'
const FILENAME_SAGA = 'saga.js'

const PROPERTY_NAME_REDUCERS = 'reducers'
const PROPERTY_NAME_SAGAS = 'sagas'

const getRelative = absolute => `./${path.relative(COLLECTIONS_DIR, absolute)}`

function getReducersAndSagas() {
  const sagas = []
  const reducers = []

  const buildItem = (name, absolutePath) => ({
    id: name.toLowerCase(),
    filepath: getRelative(absolutePath),
  })

  if (fs.existsSync(COLLECTIONS_DIR)) {
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
        reducers.push(buildItem(item.name, reducerPath))
      }

      if (fs.existsSync(sagaPath)) {
        sagas.push(buildItem(item.name, sagaPath))
      }

      return null
    })
  }

  return { sagas, reducers }
}

module.exports = function babelPluginAccumulateCollections({ types: t }) {
  function buildRequireFor(source) {
    return t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(source)]),
      t.identifier('default'),
    )
  }

  function injectProperty(params, ref, value) {
    const existingProperty = params.properties.find(property => {
      const name = property.key.name || property.key.value
      return name === ref
    })

    if (existingProperty) {
      const isArray =
        t.isArrayExpression(existingProperty.value) &&
        t.isArrayExpression(value)

      const isObject =
        t.isObjectExpression(existingProperty.value) &&
        t.isObjectExpression(value)

      if (isArray) {
        existingProperty.value.elements = [
          ...existingProperty.value.elements,
          ...value.elements,
        ]
      } else if (isObject) {
        existingProperty.value.properties = [
          ...value.properties,
          ...existingProperty.value.properties,
        ]
      }
    } else {
      const property = t.objectProperty(t.identifier(ref), value)

      params.properties.push(property)
    }
  }

  function convertToList(items) {
    const list = []

    items.forEach(item => {
      const element = buildRequireFor(item.filepath)
      list.push(element)
    })

    return t.arrayExpression(list)
  }

  function convertToObject(items) {
    const properties = []

    items.forEach(item => {
      const element = t.objectProperty(
        t.identifier(item.id),
        buildRequireFor(item.filepath),
      )
      properties.push(element)
    })

    return t.objectExpression(properties)
  }

  return {
    name: 'babel-plugin-accumulate-collections',
    visitor: {
      Program(nodePath, state) {
        const { sagas, reducers } = getReducersAndSagas()

        state.file.set('sagas', sagas)
        state.file.set('reducers', reducers)
      },

      CallExpression(nodePath, state) {
        const needToAmendAndInjectCollections =
          nodePath.get('callee').node.name === 'makeStoreConfigurer'

        if (needToAmendAndInjectCollections) {
          const sagas = state.file.get('sagas')
          const reducers = state.file.get('reducers')

          const needInjectSagas = sagas.length > 0
          const needInjectReducers = reducers.length > 0
          const hasAnythingToInject = needInjectSagas || needInjectReducers
          const noFirstArgument = nodePath.node.arguments.length === 0

          if (hasAnythingToInject && noFirstArgument) {
            const emptyObject = t.objectExpression([])
            nodePath.node.arguments.push(emptyObject)
          }

          const params = nodePath.node.arguments[0]

          if (needInjectSagas) {
            const value = convertToList(sagas)
            injectProperty(params, PROPERTY_NAME_SAGAS, value)
          }

          if (needInjectReducers) {
            const value = convertToObject(reducers)
            injectProperty(params, PROPERTY_NAME_REDUCERS, value)
          }
        }
      },
    },
  }
}
