import { useTriggerSayHello } from 'src/collections/Messages/use'

const Test = styled.div`
  color: red;
`

function Message(props) {
  const trigger = useTriggerSayHello({
    onSuccess: () => console.log('Success Callback'),
    onFailure: () => console.log('Failure Callback'),
  })

  return pug`
    p Hello from component

    Test Red Information

    = props.children

    button(onClick=trigger) Click Me
  `
}

Message.propTypes = {
  children: () => undefined,
}

export default Message
