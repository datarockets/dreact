import { useEffect } from 'react'
import styled from 'styled-components'

const Test = styled.div`
  color: red;
`

function UISmall(props) {
  useEffect(() => {
    props.callback()
  }, [])

  return pug`
    Test
      = props.children
  `
}

UISmall.propTypes = {
  children: () => undefined,
  callback: () => undefined,
}

UISmall.defaultProps = {
  callback: () => console.log('Hello After Mount'),
}

export default UISmall
