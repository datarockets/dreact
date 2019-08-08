import fs from 'fs'
import path from 'path'
import { transformSync as babelTransform } from '@babel/core'
import prettier from 'prettier'

import plugin from '../environment/babel/accumulate-collections'

jest.mock('fs')

const transform = (src, options) => {
  const transformed = babelTransform(src, {
    plugins: [plugin],
    ...options,
  }).code

  return prettier
    .format(transformed, {
      filepath: __filename,
      singleQuote: true,
      semi: false,
    })
    .trim()
}

beforeAll(() => {
  // We act like we have empty ./src/collections directory by default

  fs.readdirSync.mockReturnValue([])
  fs.existsSync.mockImplementation(filepath => {
    return /src\/collections(\/\w+\/(rerducer|saga)\.js)?$/.test(filepath)
  })
})

describe('when src/collections does not exist', () => {
  beforeAll(() => {
    fs.readdirSync.mockImplementation(() => {
      throw new Error()
    })
    fs.existsSync.mockImplementation(filepath => {
      return /src\/collections$/.test(filepath) ? false : undefined
    })
  })

  it('does not do anything', () => {
    const input = 'makeStoreConfigurer()'
    const result = transform(input)

    expect(result).toBe(input)
  })
})

describe('when src/collections is empty', () => {
  beforeAll(() => {
    fs.readdirSync.mockReturnValue([])
  })

  it('does not do anything', () => {
    const input = 'makeStoreConfigurer()'
    const result = transform(input)

    expect(result).toBe(input)
  })
})

const buildCollectionDirectory = name => ({
  isDirectory: () => true,
  name,
})

describe('when src/collections has sagas', () => {
  beforeAll(() => {
    fs.readdirSync.mockReturnValue([
      buildCollectionDirectory('First'),
      buildCollectionDirectory('Second'),
    ])

    fs.existsSync.mockImplementation(filepath => {
      return /src\/collections(\/(First|Second)\/saga\.js)?$/.test(filepath)
    })
  })

  it('adds sagas property to the empty params', () => {
    const input = 'makeStoreConfigurer()'
    const result = transform(input)

    expect(result).toMatchSnapshot()
  })

  it('adds sagas to the existing param', () => {
    const input = 'makeStoreConfigurer({ sagas: ["existing"] })'
    const result = transform(input)

    expect(result).toMatchSnapshot()
  })
})

describe('when src/collections has reducers', () => {
  beforeAll(() => {
    fs.readdirSync.mockReturnValue([
      buildCollectionDirectory('First'),
      buildCollectionDirectory('Second'),
    ])

    fs.existsSync.mockImplementation(filepath => {
      return /src\/collections(\/(First|Second)\/reducer\.js)?$/.test(filepath)
    })
  })

  it('adds reducers property to the empty params', () => {
    const input = 'makeStoreConfigurer()'
    const result = transform(input)

    expect(result).toMatchSnapshot()
  })

  it('adds reducers to the existing param', () => {
    const input = 'makeStoreConfigurer({ reducers: { form: FormReducer } })'
    const result = transform(input)

    expect(result).toMatchSnapshot()
  })
})
