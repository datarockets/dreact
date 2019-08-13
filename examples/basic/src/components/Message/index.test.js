import { shallow } from 'dreact/helper-test'
import { Provider } from 'dreact/helper-store'

import Component from '.'

const fakeStore = {
  getState() {
    return {}
  },
  subscribe() {},
  dispatch() {},
}

it('hello', () => {
  const text = 'Test sentence $$'
  const result = shallow(pug`Provider(store=fakeStore): Component= text`)

  expect(result).toExist()
})
