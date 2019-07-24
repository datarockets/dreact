# `dreact/helper-book`

It provides helpers for easier creating books with [Storybook](https://github.com/storybookjs/storybook).

## Example

```jsx
import { storiesOf } from 'dreact/helper-book'
```

## Exported

- #### `storiesOf`

### For [addon-knobs]([knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs)

- #### `array`
- #### `boolean`
- #### `button`
- #### `color`
- #### `date`
- #### `files`
- #### `number`
- #### `object`
- #### `options`
- #### `radios`
- #### `select`
- #### `text`

### For [addon-actions](https://github.com/storybookjs/storybook/tree/master/addons/actions)

- #### `action`

### Custom

- #### `Title`

  Component to render the title in stories

- #### `List` and `Item`

  Components to organize multiple items in one story

- #### `withState`

  It allows creating stories with local state inside:

  ```jsx
  import { storiesOf, withState } from 'dreact/helper-book'

  const initialState = { visible: false }

  storiesOf('Example').add(
    'Another',
    withState(
      initialState,
      ({ state }) => pug`
        button(onClick=() => state.toggle('visible')) Toggle
  
        = state.get('visible') ? 'Visible' : 'Hidden'
      `,
    ),
  )
  ```

  `state` has the following interface:

  ```jsx
  state.set(updates) // `updates` will be passedd to `this.setState`
  ```

  ```jsx
  state.get([key]) // Will return the whole state or the value related to `key`
  ```

  ```jsx
  state.toggle(key) // Will get value for key and set the negated version
  ```
