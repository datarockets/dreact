import { takeEvery, take, delay, cancel, fork } from 'redux-saga/effects'

const MAX_WAITING_FOR_ACTION = 20000

const INIT_PATTERN = /\/INIT$/

const isInitAction = action => INIT_PATTERN.test(action.type)
const getActionType = (type, target) => type.replace(INIT_PATTERN, `/${target}`)

const getCallback = (payload, name) =>
  (payload && payload[name]) || (() => null)

export default function* () {
  yield takeEvery(isInitAction, function* ({ type, payload }) {
    const onSuccessHandler = getCallback(payload, 'onSuccess')
    const onFailureHandler = getCallback(payload, 'onFailure')

    let successWatcher
    let failureWatcher

    function* stopWacthers() {
      yield cancel(successWatcher)
      yield cancel(failureWatcher)
    }

    successWatcher = yield fork(function* () {
      const action = yield take(getActionType(type, 'SUCCESS'))
      onSuccessHandler(action.payload)
      yield stopWacthers()
    })

    failureWatcher = yield fork(function* () {
      const action = yield take(getActionType(type, 'FAILURE'))
      onFailureHandler(action.payload)
      yield stopWacthers()
    })

    yield delay(MAX_WAITING_FOR_ACTION)

    yield stopWacthers()
  })
}
