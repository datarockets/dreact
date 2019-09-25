import { shallow, mount } from 'dreact/helper-test'

import Component from '.'

const requiredProps = {
  callback: () => null,
}

it('hello', () => {
  const text = 'Test sentence $$'
  const result = shallow(pug`Component(...requiredProps)= text`)

  expect(result).toIncludeText(text)
})

it('executes callback in useEffect when shallow render', () => {
  const callback = jest.fn()
  shallow(pug`Component(...requiredProps callback=callback) asd`)

  expect(callback).toHaveBeenCalledTimes(1)
})

it('executes callback in useEffect when mount', () => {
  const callback = jest.fn()
  mount(pug`Component(...requiredProps callback=callback) asd`)

  expect(callback).toHaveBeenCalledTimes(1)
})
