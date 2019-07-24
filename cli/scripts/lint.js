const path = require('path')

const eslintCli = require('eslint/lib/cli')
const stylelintCli = require('stylelint/lib/cli')

const getConfigPath = name => path.resolve(__dirname, '..', 'environment', name)

module.exports = function(argv) {
  if (argv[1] === 'js') {
    const configPath = getConfigPath('eslint.config.js')
    process.exitCode = eslintCli.execute([
      'eslint',
      './config',
      './src',
      '--no-eslintrc',
      '--config',
      configPath,
      ...argv.slice(2),
    ])
    return
  }

  if (argv[1] === 'styles') {
    const configPath = getConfigPath('stylelint.config.js')
    process.exitCode = stylelintCli([
      './src/**/*.js',
      '--config',
      configPath,
      ...argv.slice(2),
    ])
    return
  }
}
