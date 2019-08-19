const ruleCollectionNamedExports = require('./ruleCollectionNamedExports')
const ruleComponentFunction = require('./ruleComponentFunction')
const ruleComponentNames = require('./ruleComponentNames')
const ruleHaveTests = require('./ruleHaveTests')
const ruleRequireAliases = require('./ruleRequireAliases')
const ruleUseAtoms = require('./ruleUseAtoms')

module.exports = {
  rules: {
    'collection-named-exports': ruleCollectionNamedExports,
    'component-function': ruleComponentFunction,
    'component-names': ruleComponentNames,
    'have-tests': ruleHaveTests,
    'require-aliases': ruleRequireAliases,
    'use-atoms': ruleUseAtoms,
  },
}
