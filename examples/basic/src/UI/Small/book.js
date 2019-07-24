import { storiesOf } from 'dreact/book'

import Small from '.'

storiesOf('Utils|Box', module).add('Default', () => {
  return pug`
      Small Hello
    `
})
