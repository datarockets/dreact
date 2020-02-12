const path = require('path')
const aliasManager = require('module-alias')
const Module = require('module')
const { execSync } = require('child_process')

const CWD = process.cwd()

const getLocalDependency = (name = '') =>
  path.resolve(CWD, 'node_modules', name)

module.exports = argv => {
  const command = argv[0]
  const forwardArgs = argv.slice(1)

  aliasManager.addPath(getLocalDependency())

  // aliasManager.addAlias('react', getLocalDependency('react'))
  // aliasManager.addAlias('react-dom', getLocalDependency('react-dom'))

  // aliasManager.addAliases({
  //   react: getLocalDependency('react'),
  //   'react-dom': getLocalDependency('react-dom'),
  // })
  // const oldNodeModulePaths = Module._nodeModulePaths
  // Module._nodeModulePaths = function(from) {
  //   var paths = oldNodeModulePaths.call(this, from)
  //
  //   // Only include the module path for top-level modules
  //   // that were not installed:
  //   // if (from.indexOf('node_modules') === -1) {
  //   //   paths = modulePaths.concat(paths)
  //   // }
  //
  //   return [getLocalDependency(), ...paths]
  // }
  //
  // const old = Module._resolveFilename.bind(Module)
  //
  // Module._resolveFilename = function(request, parentModule, isMain, options) {
  //   // if (p.indexOf('react') > -1) {
  //   //   console.log(p)
  //   // }
  //   let t
  //
  //   try {
  //     t = old.call(this, request, parentModule, isMain, options)
  //   } catch (e) {
  //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===============')
  //     console.log(e)
  //   }
  //
  //   return t
  // }

  switch (command) {
    case 'dev': {
      require('./overriding/server')
    }

    case 'build': {
      process.env.NODE_ENV = 'production'
      const { default: build } = require('next/dist/build')
      // execSync('next build ./src')
      build(path.resolve(CWD, 'src'), require('./overriding/next.config'))
        .then(() => process.exit(0))
        .catch(err => {
          // tslint:disable-next-line
          console.error('> Build error occurred')
          console.error(err)
          process.exit(1)
        })
    }
  }
}
