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
        {
            code: `
                class X {
                    x() {}
                    y() {}
                }
            `,
            parserOptions: { ecmaVersion: 6 },
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
            errors: [
                { message: 'FunctionDeclaration y not sorted', type: 'FunctionDeclaration' },
                { message: 'FunctionDeclaration x not sorted', type: 'FunctionDeclaration' },
            ],
        },
        {
            code: `
                class X {
                    y() {}
                    x() {}
                }
            `,
            output: `
                class X {
                    x() {}
                    y() {}
                }
            `,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: 'MethodDefinition y not sorted', type: 'MethodDefinition' },
                { message: 'MethodDefinition x not sorted', type: 'MethodDefinition' },
            ],
        },
    ]
});
