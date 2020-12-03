import { effects } from 'dreact/helper-store'

import * as actions from './actions'

function* saveMessage() {
  yield console.log('[saveMessage][saga] started')

  yield effects.delay(1000)
  yield console.log('[saveMessage][saga] will trigger success')
  yield effects.put(actions.saveMessage.success())

  yield effects.delay(1000)
  yield console.log('[saveMessage][saga] will trigger failure')
  yield effects.put(actions.saveMessage.failure())
}

export default function* () {
  yield effects.all([
    effects.call(function* watchBasicActions() {
      yield effects.takeEvery(actions.saveMessage.INIT, saveMessage)
    }),
  ])
}
