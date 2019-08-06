import { useTriggerSayHello } from 'src/collections/Messages/use'

const Test = styled.div`
  color: red;
`

function Component(props) {
  const trigger = useTriggerSayHello()

  return pug`
    p Hello from component

    Test Red Information

    = props.children

    button(onClick=trigger) Click Me
  `
}

Component.propTypes = {
  children: () => undefined,
}

export default Component
