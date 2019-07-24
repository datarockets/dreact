import styled from 'styled-components'

const Test = styled.div`
  color: red;
`

function UISmall(props) {
  return pug`
    Test
      = props.children
  `
}

UISmall.propTypes = {
  children: () => undefined,
}

export default UISmall
