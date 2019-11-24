const {
  compareNullableString,
} = require('../utils/sort');
const {
  getFunctionDeclarationName,
  getMethodDefinitionName,
  getNodeRange,
  isFunctionDeclaration,
  isMethodDefinition,
} = require('../utils/estree');
const { isSortedAscending } = require('../utils/list');

module.exports = {
  create: function(context) {
    return {
      FunctionDeclaration: (node) => hoistFunctionDeclaration(context, node),
      MethodDefinition: (node) => hoistMethodDefinition(context, node),
    };
  },
};


function hoistFunctionDeclaration(context, node) {
  const siblings = node.parent.body
    .filter(n => isFunctionDeclaration(n));
  const names = siblings.map(n => getFunctionDeclarationName(n));

  if (!isSortedAscending(names)) {
    context.report({
      node,
      message: `FunctionDeclaration ${getFunctionDeclarationName(node)} not sorted`,
      fix: (fixer) => {
        const sourceRanges = siblings.map(n => getNodeRange(n));
        const sortedSiblings = siblings.sort(
          (a, b) => (
            compareNullableString(
              getFunctionDeclarationName(a),
              getFunctionDeclarationName(b)
            )
          ));

        const fixes = sourceRanges.map((range, i) => {
          const sourceText = context.getSource(sortedSiblings[i]);
          return fixer.replaceTextRange(range, sourceText);
        });

        return fixes;
      },
    });
  }
}

function hoistMethodDefinition(context, node) {
  const siblings = node.parent.body
    .filter(n => isMethodDefinition(n));
  const names = siblings.map(n => getMethodDefinitionName(n));

  if (!isSortedAscending(names)) {
    context.report({
      node,
      message: `MethodDefinition ${getMethodDefinitionName(node)} not sorted`,
      fix: (fixer) => {
        const sourceRanges = siblings.map(n => getNodeRange(n));
        const sortedSiblings = siblings.sort(
          (a, b) => (
            compareNullableString(
              getMethodDefinitionName(a),
              getMethodDefinitionName(b)
            )
          ));

        const fixes = sourceRanges.map((range, i) => {
          const sourceText = context.getSource(sortedSiblings[i]);
          return fixer.replaceTextRange(range, sourceText);
        });

        return fixes;
      },
    });
  }
}
