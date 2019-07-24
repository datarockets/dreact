import { createGlobalStyle } from 'styled-components'

const FontFamily = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  body {
    font-family: Roboto;
  }
`

function WithFont(props) {
  return pug`
    FontFamily
    = props.children
  `
}

export default storyFn => pug`
  WithFont
    = storyFn()
`
