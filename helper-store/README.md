# `dreact/helper-store`

Organize store for redux with redux-saga.

## Exported

- #### `default`

  ```jsx
  import makeStoreConfigurer from 'dreact/helper-store'

  export default makeStoreConfigurer(params)

  export default makeStoreConfigurer({
    initialState: {},

    sagas: [
      require('./custom-saga.js').default,
    ],

    reducers: {
      form: require('redux-form').reducer,
    },

    reducerMiddleware: appReducer => (state, action) => {
      if (action.type === logoutAction.SUCCESS) {
        return appReducer(undefined, action)
      }

      return appReducer(state, action)
    },
  })
  ```

  #### Params

  - ##### `initialState` (optional, object, default `{}`)

    Initial state of the entire store

  - ##### `sagas` (optional, array)

    Contains references to necessary sagas which will be combined then

    ```jsx
    sagas: [require('src/lib/custom-saga.js').default]
    ```

    In addition to that the list will be extended with sagas defined inside collections. It's done by babel.

  - ##### `reducers` (optional, object)

    Contains references to necessary reducers which will be combined then

    ```jsx
    reducers: {
      form: require('redux-form').reducer,
    }
    ```

    In addition to that the object will be extended with reducers defined inside collections. It's done by babel. Reducers specified manually will override automatically added.

  - ##### `reducerMiddleware` (optional, function)

    In case you'd like to handle actions and changes in reducer you can do that here by creating a middleware on top of main reducer.

    ```jsx
    reducerMiddleware: appReducer => (state, action) => {
      // Define custom behavior for actions with type 'LOGOUT'
      if (action.type === 'LOGOUT') {
        return appReducer(undefined, action)
      }

      // Proceed with default behavior:
      return appReducer(state, action)
    }
    ```

- #### `effects`

  It's an alias of used [`redux-saga/effects`](https://redux-saga.js.org/docs/api/) inside.

### From [`react-redux`](https://github.com/reduxjs/react-redux)

- #### `useDispatch`
- #### `useSelector`
- #### `Provider`
