import React from 'react'
import styled from 'styled-components'

import { storiesOf as originalStoriesOf } from '@storybook/react'

export {
  array,
  boolean,
  button,
  color,
  date,
  files,
  number,
  object,
  options,
  radios,
  select,
  text,
} from '@storybook/addon-knobs'

export { action } from '@storybook/addon-actions'

export const storiesOf = (...args) => {
  console.error('"storiesOf" from dreact/helper-book is deprecated')
  return originalStoriesOf(...args)
}

export const withState = (initialState = {}, storyFn) => {
  class StatefulComponent extends React.Component {
    constructor() {
      super()

      this.state = initialState

      this.stateManager = {
        set: value => {
          this.setState(value)
        },
        toggle: key => {
          this.setState(state => ({
            [key]: !state[key],
          }))
        },
        get: value => (value ? this.state[value] : this.state),
      }
    }

    render() {
      return storyFn({ ...this.props, state: this.stateManager })
    }
  }

  return () => React.createElement(StatefulComponent)
}

export const Title = styled.h1`
  margin-top: 1.3em;
  margin-bottom: 0.6em;
  font-weight: 500;

  sup {
    padding: 0.45em 0.6em;
    background-color: #ffe2ed;
    border-radius: 2rem;
    color: #300f1c;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.55em;
    letter-spacing: 0.05em;
  }
`

export const List = styled.div`
  margin: -1rem;
`

export const Item = styled.div`
  margin: 1rem;
  display: inline-block;
`
