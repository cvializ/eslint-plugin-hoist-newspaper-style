
// In your tests:
const rule = require('../rules/hoist-newspaper-style');
const { RuleTester } = require('eslint');

var ruleTester = new RuleTester();
ruleTester.run('hoist-newspaper-style', rule, {
    valid: [
        {
            code: `
                function x() {}
                function y() {}
            `,
        },
    ],
    invalid: [
        {
            code: `
                function y() {}
                function x() {}
            `,
            output: `
                function x() {}
                function y() {}
            `,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: 'FunctionDeclaration y not sorted', type: 'FunctionDeclaration' },
                { message: 'FunctionDeclaration x not sorted', type: 'FunctionDeclaration' },
            ],
        },
    ]
});
