# dreact

Build web applications as easy as datarockets do 🚀

```sh
yarn add dreact
```

## What?

Maintain projects easier by applying reusage of everything.

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
  
- #### Linting
  
  We use eslint and stylelint to lint our files. Also we applied several custom rules there to reach our needs: we request named exports for collection stuff, we request using normal functions to define components, we require tests for each file in the app. [Take a look at all rules](./cli/environment/eslint-plugin-local).
  
- #### Automatic imports

  We import React and styled components where they are used automatically.

## Configuration

- #### `/config/babel.config.js`

  The babel config will be based on this file and refined.

- #### `/config/book.setup-item.js`

  Specify a decorator for storybook. Usually used to add some wrappers around each story.

- #### `/config/eslint.config.js`

  Modify our internal eslint config to conform your needs.

- #### `/config/jest.setup.js`

  Setup jest to run tests on your terms.

## CLI

- #### `dreact app start`

  Run the app in development mode

- #### `dreact book start`

  Run the book in development mode

- #### `dreact lint js`

  Lint JavaScript files

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
