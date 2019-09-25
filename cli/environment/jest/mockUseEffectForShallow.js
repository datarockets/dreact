let mockUseEffects = []
let mockBoolWhenNeedMockHook = false

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cllb, deps) =>
    mockBoolWhenNeedMockHook
      ? mockUseEffects.push(cllb)
      : jest.requireActual('react').useEffect(cllb, deps),
}))

jest.mock('dreact/helper-test', () => {
  const unmocked = jest.requireActual('dreact/helper-test')

  const shallow = (...args) => {
    mockUseEffects = []
    mockBoolWhenNeedMockHook = true

    const result = unmocked.shallow(...args)

    mockUseEffects.forEach(cllb => cllb())
    mockBoolWhenNeedMockHook = false

    return result
  }

  return {
    ...unmocked,
    shallow,
  }
})
