import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'

import errorCatcher from '../helper-sentry'
import sagaHandleCallbacks from './saga.handleCallbacks'

function makeStoreConfigurer(params) {
  if (process.env.NODE_ENV !== 'production') {
    if (!params.reducers) {
      throw new Error('reducers is required for makeStoreConfigurer')
    }

    if (!params.sagas) {
      throw new Error('sagas is required for makeStoreConfigurer')
    }
  }

  if (!params.initialState) {
    params.initialState = {}
  }

  const composeEnhancers =
    process.env.NODE_ENV === 'development'
      ? // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : compose

  const appReducer = combineReducers(params.reducers)

  const shouldCaptureAction = action => !/^@@redux-form/.test(action.type)
  const shouldCapturePayload = action =>
    !/^Session/.test(action.type) && !/\/(SUCCESS|FAILURE)/i.test(action.type)

  const rootReducer = (state, action) => {
    const { type, ...actionData } = action

    if (shouldCaptureAction(action)) {
      errorCatcher.addBreadcrumb({
        message: type,
        data: shouldCapturePayload(action) ? actionData : {},
        category: 'redux.action',
        level: 'debug',
      })
    }

    const enhancedAppReducer = params.reducerMiddleware
      ? params.reducerMiddleware(appReducer)
      : appReducer

    return enhancedAppReducer(state, action)
  }

  function* rootSaga(run) {
    const task = yield sagaEffects.fork(function* () {
      yield sagaEffects.all([
        ...params.sagas.map(saga => sagaEffects.call(saga)),
        sagaEffects.call(sagaHandleCallbacks),
      ])
    })

    yield sagaEffects.take(RESTART.type)
    yield sagaEffects.cancel(task)

    run(rootSaga, run)
  }

  return (initialState = params.initialState) => {
    const sagaMiddleware = createSagaMiddleware({
      onError: (error, info) => {
        errorCatcher.report(error, info)
        console.error(error)
        console.error(info.sagaStack)
      },
    })

    const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

    const store = createStore(rootReducer, initialState, enhancer)

    sagaMiddleware.run(rootSaga, sagaMiddleware.run)

    return store
  }
}

export { useDispatch, useSelector, Provider } from 'react-redux'

export const effects = sagaEffects

export const RESTART = {
  type: '@@redux-saga/ROOT_RESTART',
}

export default makeStoreConfigurer
