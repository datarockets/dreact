let isConsoleWarningOrError = false

beforeEach(() => {
  isConsoleWarningOrError = false
  const originalError = global.console.error.bind(global.console)
  jest.spyOn(global.console, 'error').mockImplementation((...args) => {
    isConsoleWarningOrError = true
    originalError(...args)
  })
  const originalWarn = global.console.warn.bind(global.console)
  jest.spyOn(global.console, 'warn').mockImplementation((...args) => {
    isConsoleWarningOrError = true
    originalWarn(...args)
  })
})

afterEach(() => {
  if (isConsoleWarningOrError) {
    throw new Error('Console warnings and errors are not allowed')
  }
})
