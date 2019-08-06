import ReactDOM from 'react-dom'
import { Provider } from 'dreact/helper-store'

import configureStore from 'src/collections/store'

import Message from 'src/components/Message'

ReactDOM.render(
  pug`Provider(store=configureStore()): Message`,
  document.getElementById('root'),
)
