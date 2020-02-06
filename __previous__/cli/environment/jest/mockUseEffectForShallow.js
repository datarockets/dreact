let mockUseEffects = []
let mockBoolWhenNeedMockHook = false

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cllb, deps) =>
    mockBoolWhenNeedMockHook
      ? mockUseEffects.push(cllb)
      : jest.requireActual('react').useEffect(cllb, deps),
}))

const mockWithUseEffect = callback => {
  mockUseEffects = []
  mockBoolWhenNeedMockHook = true

  const result = callback()

  mockUseEffects.forEach(cllb => cllb())
  mockBoolWhenNeedMockHook = false

  return result
}

jest.mock('dreact/helper-test', () => {
  const unmocked = jest.requireActual('dreact/helper-test')

  // We mock ShallowWrapper to make sure we execute all useEffects after
  class ShallowWrapper extends unmocked.ShallowWrapper {
    constructor(...args) {
      mockWithUseEffect(() => super(...args))
    }
  }

  const shallow = (node, options) => {
    const result = new ShallowWrapper(node, null, options)

    // `rerender` method triggered internally by `setProps`
    const rerender = result.rerender.bind(result)
    result.rerender = (...args) => mockWithUseEffect(() => rerender(...args))

    return result
  }

  return {
    ...unmocked,
    shallow,
  }
})
