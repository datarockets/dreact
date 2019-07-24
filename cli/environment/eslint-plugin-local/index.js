const ruleComponentNames = require('./ruleComponentNames')
const ruleHaveTests = require('./ruleHaveTests')
const ruleRequireAliases = require('./ruleRequireAliases')
const ruleUseAtoms = require('./ruleUseAtoms')

module.exports = {
  rules: {
    'component-names': ruleComponentNames,
    'have-tests': ruleHaveTests,
    'require-aliases': ruleRequireAliases,
    'use-atoms': ruleUseAtoms,
  },
}
