import { shallow } from 'enzyme'

import Component from '.'

it('hello', () => {
  const text = 'Test sentence $$'
  const result = shallow(pug`Component= text`)

  expect(result).toIncludeText(text)
})
