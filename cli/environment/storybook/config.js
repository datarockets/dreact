import path from 'path'

import { configure, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

const pathToSetupItem = path.resolve(
  process.cwd(),
  'config',
  'book.setup-item.js',
)

addDecorator(withKnobs)

try {
  const decorator = require('process.cwd/config/book.setup-item.js').default
  addDecorator(decorator)
} catch (error) {}

function loadStories() {
  const req = require.context('process.cwd/src/UI', true, /\/book\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
