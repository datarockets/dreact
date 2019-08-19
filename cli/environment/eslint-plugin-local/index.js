const ruleComponentFunction = require('./ruleComponentFunction')
const ruleComponentNames = require('./ruleComponentNames')
const ruleHaveTests = require('./ruleHaveTests')
const ruleRequireAliases = require('./ruleRequireAliases')
const ruleUseAtoms = require('./ruleUseAtoms')

module.exports = {
  rules: {
    'component-function': ruleComponentFunction,
    'component-names': ruleComponentNames,
    'have-tests': ruleHaveTests,
    'require-aliases': ruleRequireAliases,
    'use-atoms': ruleUseAtoms,
  },
}
