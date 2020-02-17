const [scriptName, ...forwardArgs] = process.argv.slice(2)

switch (scriptName) {
  case 'app':
    return require('./script-app')(forwardArgs)

  default:
    console.log('No Script')
}
