import { storiesOf } from 'dreact/helper-book'

import Small from '.'

storiesOf('Utils|Box', module).add(
  'Default',
  () => pug`
    Small Hello
  `,
)
