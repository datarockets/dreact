import _ from 'lodash'
import { takeEvery, take, delay, cancel, fork } from 'redux-saga/effects'

const MAX_WAITING_FOR_ACTION = 20000

const INIT_PATTERN = /\/INIT$/

const isInitAction = action => INIT_PATTERN.test(action.type)
const getActionType = (type, target) => type.replace(INIT_PATTERN, `/${target}`)

export default function*() {
  yield takeEvery(isInitAction, function*({ type, payload }) {
    const onSuccessHandler = _.get(payload, 'onSuccess', _.noop)
    const onFailureHandler = _.get(payload, 'onFailure', _.noop)

    const successWatcher = yield fork(function*() {
      const action = yield take(getActionType(type, 'SUCCESS'))
      onSuccessHandler(action.payload)
    })

    const failureWatcher = yield fork(function*() {
      const action = yield take(getActionType(type, 'FAILURE'))
      onFailureHandler(action.payload)
    })

    yield delay(MAX_WAITING_FOR_ACTION)

    yield cancel(successWatcher)
    yield cancel(failureWatcher)
  })
}
