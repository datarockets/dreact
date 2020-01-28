import { text } from 'dreact/helper-book'

import Small from '.'

export default {
  title: 'Small',
}

export function Default() {
  return pug`
    Small= text('content', 'Some Text')
  `
}
