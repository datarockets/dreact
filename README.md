# dreact

Build web applications as easy as datarockets do 🚀

```sh
yarn add dreact
```

## What?

Maintain projects easier by applying reusage of everything. It's based on [react-scripts (create react app)](https://github.com/facebook/create-react-app) so you can use all of its features. We provide redux and styled-components configuration out of the box.

Content:

- [Environment](#environment)
- [How to organize the project](#how-to-organize-the-project)
- [How to create and use store](#how-to-create-and-use-store)
- [How to write sagas and containers related to store](#how-to-write-sagas-and-containers-related-to-store)
- [How to write tests](#how-to-write-tests)
- [How to integrate with Sentry](#how-to-integrate-with-sentry)
- [Configuration](#configuration)
- [CLI](#cli)
- [Deployment](#deployment)

## Environment

The app is based on [react-scripts](https://github.com/facebook/create-react-app). And book is based on [storybook](https://github.com/storybookjs/storybook).

- #### Pug

  We use Pug to write render methods. See [babel-plugin-transform-react-pug](https://github.com/pugjs/babel-plugin-transform-react-pug).

- #### Aliases

  We provide `src` and `UI` aliases that point to `./src` and `./src/UI`.

- #### Pass variables from `.env.local`

  I recommend to maintain `.env.sample` to always contain variables necessary for development and sync it via `dreact env-sync` command.

- #### Configured tests

  We use [Jest](https://jestjs.io) + [Enzyme](https://airbnb.io/enzyme/). To make test writing easier, we configured it:

  - The execcution of console.error is forbidden. This is mostly to prevent mismatching of prop types.
  - Extended functioinality with [jest-enzyme](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme#assertions).
  - Element's attribute `TESTID` in tests for easier selecting nodes n tests.

- #### Addons for storybook

  We added [knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs), [storysource](https://github.com/storybookjs/storybook/tree/master/addons/storysource) and [actions](https://github.com/storybookjs/storybook/tree/master/addons/actions).

- #### Simple creating action creators

  All `new Action()` constructions inside `/src/collections/*/actions.js` will be transformed into `createAction` exported by `dreact/helper-actions`.

- #### Success/Failure callbacks for actions

  Each `.success()` and `.failure()` actions trigger callbacks passed to `.init()` action.

  For example, when we initialize any action we can pass `onSuccess` and `onFailure` callbacks which will be triggered when corresponding success and failure actions are dispatched.

  ```js
  const message = new Action({
    init: data => data, // It's important to pass values
  })

  const action = message.init({
    text: 'hello',
    onSuccess: () => alert('Message has been sent'),
    onFailure: () => alert('Failed to send message'),
  })
  dispatch(action)

  dispatch(message.success()) // Triggers `onSuccess` callback
  dispatch(message.failure()) // Triggers `onFailure` callback
  ```

- #### Linting

  We use eslint and stylelint to lint our files. Also we applied several custom rules there to reach our needs: we request named exports for collection stuff, we request using normal functions to define components, we require tests for each file in the app. [Take a look at all rules](./cli/environment/eslint-plugin-local).

- #### Automatic imports

  We import React and styled components where they are used automatically.

## How to organize the project

The basic structure looks like this:

```
/config — to configure the project
/public
  index.html

/src
  /collections
    ...
    store.js
  /components
  /containers
  /forms
  /lib
  /pages
  /services
  /UI

  AppRouter.js
  index.js
  routes.js
```

## How to create and use store

We create and export store in `src/collections/store.js`:

```js
import makeStoreConfigurer from 'dreact/helper-store'

export default makeStoreConfigurer()
```

Everything will be pulled from collections and added automatically. However you might need to extend it, so take a look at [`dreact/helper-store` documentation](./helper-store).

_Note: When we create or remove collectons we should restart the app._

To connect the store with the app we need to modify `src/index.js`:

```js
import ReactDOM from 'react-dom'
import { Provider } from 'dreact/helper-store'

import AppRouter from 'src/AppRouter'

import configureStore from 'src/collections/store'

const store = configureStore()

ReactDOM.render(
  pug`
    Provider(store=store)
      AppRouter
  `,
  document.getElementById('root'),
)
```

## How to write sagas and containers related to store

So basically we need saga effects and some hooks to maintain everything related to store. For that we have [`dreact/helper-store`](./helper-store).

```js
import { effects, useDispatch, useSelector } from 'dreact/helper-store'
```

## How to write tests

There are no instructions. Earlier you've been told that we use enzyme for testing, but we built an enhancements on top of it, so to get an access to enzyme we should use `dreact/helper-test`.

Your test may look like this:

```js
import { shallow } from 'dreact/helper-test'

import Component from '.'

it('is rendered', () => {
  shallow(pug`Component Hello World`)
})
```

Take a look at [`dreact/helper-test` documentation](./helper-test).

## How to integrate with [Sentry](https://sentry.io)

To implement the integration with sentry we need to set `REACT_APP_SENTRY_DSN`, `REACT_APP_SENTRY_ENV` environment variables. Once they are set, it will start sending reports to sentry.

## Configuration

- #### `/config/babel.config.js`

  The babel config will be based on this file and refined.

- #### `/config/book.setup-item.js`

  Specify a decorator for storybook. Usually used to add some wrappers around each story.

  ```js
  export default storyFn = pug`
    p I'll appear before each story
    = storyFn()
  `
  ```

- #### `/config/eslint.config.js`

  Modify our internal eslint config to conform your needs.

- #### `/config/stylelint.config.js`

  Modify our internal stylelint config to conform your needs.

- #### `/config/jest.setup.js`

  Setup jest to run tests on your terms.

## CLI

- #### `dreact app start`

  Run the app in development mode

- #### `dreact book start`

  Run the book in development mode

- #### `dreact lint js`

  Lint JavaScript files

- #### `dreact lint ts`

  Lint Typescript (.ts, .tsx) files

- #### `dreact lint styles`

  Lint styles in the project

- #### `dreact test`

  Run tests in watch mode (on CI it will be run in a normal mode)

- #### `dreact env-sync`

  Synchronize `.env.sample` file with `.env.local`

## Deployment

- #### `dreact app build`

  It creates `/build` directory that can be deployed to static server such as S3.

- #### `dreact book build`

  It creates `/book` directory that can be deployed to static server such as S3.
