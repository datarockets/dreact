const Test = styled.div`
  color: red;
`

function Component(props) {
  return pug`
    p Hello from component

    Test Red Information

    = props.children
  `
}

Component.propTypes = {
  children: () => undefined,
}

export default Component
