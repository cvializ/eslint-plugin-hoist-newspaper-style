const rule = require('../rules/hoist-newspaper-style');
const { RuleTester } = require('eslint');

var ruleTester = new RuleTester();
ruleTester.run('hoist-newspaper-style', rule, {
    valid: [
        {
            code: `
                function eat() {
                    sleep();
                }
                function sleep() {}
            `,
        },
        {
            code: `
                class Day {
                    eat() {
                        this.sleep()
                    }
                    sleep() {}
                }
            `,
            parserOptions: { ecmaVersion: 6 },
        },
    ],
    invalid: [
        {
            code: `
                function sleep() {}
                function eat() {
                    sleep();
                }
            `,
            output: `
                ${/* dummy substitution to preserve preceding whitespace */''}
                function eat() {
                    sleep();
                }
                function sleep() {}
            `,
            errors: [
                { message: 'FunctionDeclaration sleep found above reference.', type: 'FunctionDeclaration' },
            ],
        },
        {
            code: `
                class Day {
                    sleep() {}
                    eat() {
                        this.sleep();
                    }
                }
            `,
            output: `
                class Day {
                    ${/* dummy substitution to preserve preceding whitespace */''}
                    eat() {
                        this.sleep();
                    }
                    sleep() {}
                }
            `,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: 'MethodDefinition sleep found above reference.', type: 'MethodDefinition' },
            ],
        },
    ]
});
