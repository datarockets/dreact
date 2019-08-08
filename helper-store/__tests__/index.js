import _ from 'lodash'

const entry = require('..')

describe('exports', () => {
  describe('default', () => {
    const method = entry.default

    const requiredOptions = { reducers: {}, sagas: [] }

    it('is function', () => {
      expect(_.isFunction(method)).toBeTruthy()
    })

    it('requires sagas parameter', () => {
      const { sagas, ...rest } = requiredOptions
      expect(() => method(rest)).toThrow('sagas is required')
    })

    it('requires reducers parameter', () => {
      const { reducers, ...rest } = requiredOptions
      expect(() => method(rest)).toThrow('reducers is required')
    })

    it('returns a function', () => {
      const result = method(requiredOptions)
      expect(_.isFunction(result)).toBeTruthy()
    })
  })

  describe('effects', () => {
    const { effects } = entry
    const correctEffects = require('redux-saga/effects')

    it('returns the list of all effects', () => {
      expect(effects).toBe(correctEffects)
    })
  })

  describe('useDispatch', () => {
    it('returns useDispatch from react-redux', () => {
      expect(entry.useDispatch).toBe(require('react-redux').useDispatch)
    })
  })

  describe('useSelector', () => {
    it('returns useSelector from react-redux', () => {
      expect(entry.useSelector).toBe(require('react-redux').useSelector)
    })
  })

  describe('Provider', () => {
    it('returns Provider from react-redux', () => {
      expect(entry.Provider).toBe(require('react-redux').Provider)
    })
  })
})
