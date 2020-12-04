import { withState, text } from 'dreact/helper-book'

import Small from '.'

export default {
  title: 'UI|Small',
}

export function Default() {
  return pug`
    Small= text('content', 'Some Text, configure in knobs')
  `
}

export const TestWithState = withState({ text: '' }, ({ state }) => {
  return pug`
    Small= state.get('text') || 'Type below to change text'

    br

    input(value=state.get('text') onChange=() => state.set({ text: event.target.value }))
  `
})
