import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'

import errorCatcher from '../helper-sentry'

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

  const rootReducer = params.reducerMiddleware
    ? params.reducerMiddleware(appReducer)
    : appReducer

  function* rootSaga() {
    yield sagaEffects.all(params.sagas.map(saga => sagaEffects.call(saga)))
  }

  return (initialState = params.initialState) => {
    const sagaMiddleware = createSagaMiddleware({
      onError: (error, info) => errorCatcher.report(error, info),
    })

    const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

    const store = createStore(rootReducer, initialState, enhancer)

    sagaMiddleware.run(rootSaga)

    return store
  }
}

export { useDispatch, useSelector, Provider } from 'react-redux'

export const effects = sagaEffects

export default makeStoreConfigurer
