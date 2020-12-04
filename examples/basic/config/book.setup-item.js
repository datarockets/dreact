import { createGlobalStyle } from 'styled-components'

const FontFamily = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  body {
    font-family: Roboto;
  }
`

/* eslint-disable react-pug/prop-types */

function WithFont(props) {
  return pug`
    FontFamily
    = props.children
  `
}

function StoryItemWrapper(storyFn) {
  return pug`
    WithFont
      p Every story has this message
      = storyFn()
  `
}

export default StoryItemWrapper
