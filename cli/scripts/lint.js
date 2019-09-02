const path = require('path')

const eslintCli = require('eslint/lib/cli')
const stylelintCli = require('stylelint/lib/cli')

const getConfigPath = name => path.resolve(__dirname, '..', 'environment', name)

module.exports = function(argv) {
  if (argv[0] === 'js') {
    const configPath = getConfigPath('eslint.config.js')
    process.exitCode = eslintCli.execute([
      'eslint',
      '--no-eslintrc',
      '--config',
      configPath,
      ...argv.slice(1),
      './',
    ])
    return
  }

  if (argv[0] === 'styles') {
    const configPath = getConfigPath('stylelint.config.js')
    process.exitCode = stylelintCli([
      '--config',
      configPath,
      ...argv.slice(1),
      './src/**/*.js',
    ])
    return
  }
}
