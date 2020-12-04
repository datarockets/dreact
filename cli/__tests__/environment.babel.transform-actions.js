import { transformSync as babelTransform } from '@babel/core'
import prettier from 'prettier'

import plugin from '../environment/babel/transform-actions'

const transform = (src, options) => {
  const transformed = babelTransform(src, {
    plugins: [plugin],
    ...options,
  }).code

  return prettier.format(transformed, {
    filepath: __filename,
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    arrowParens: 'avoid',
  })
}

it('transforms empty new Action', () => {
  const input = 'const myActionCreators = new Action()'

  const result = transform(input, {
    filename: '/Project/src/collections/CollectionName/actions.js',
  })

  expect(result).toMatchSnapshot()
})

it('passes the first argument to transformed function', () => {
  const input = `
    const test = new Action({
      init: one => ({ two: one })
    })
  `

  const result = transform(input, {
    filename: '/Project/src/collections/CollectionName/actions.js',
  })

  expect(result).toMatchSnapshot()
})

it('does not change when outside of actions file', () => {
  const input = 'const myActionCreators = new Action()'

  const result = transform(input, {
    filename: '/Project/src/collections/CollectionName/saga.js',
  })

  expect(result).toMatchSnapshot()
})
