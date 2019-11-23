const Linter = require('eslint').Linter;
const RuleTester = require("eslint").RuleTester;

const linter = new RuleTester({
  'parserOptions': { 'ecmaVersion': 6 }
});

const ruleTester = new RuleTester();

const results = linter.verify(`

`, { rules: { 'my-custom-rule': 2 } });

console.log(results);

