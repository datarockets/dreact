const detectComponents = require('eslint-plugin-react-pug/lib/util/detectComponents')

module.exports = {
  create: detectComponents((context, components) => {
    return {
      'Program:exit': function() {
        const list = components.list()

        Object.keys(list).forEach(id => {
          const component = list[id]

          if (component.node.type !== 'FunctionDeclaration') {
            context.report({
              node: component.node,
              message: 'Use normal functions to define components',
            })
          }
        })
      },
    }
  }),
}
