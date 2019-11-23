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
            compare(
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
            compare(
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

function compare(a, b) {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null && typeof b === 'string') {
    return 1;
  }
  if (b === null && typeof a === 'string') {
    return -1;
  }

  return String.prototype.localeCompare.call(a, b);
}

function getNodeRange(node) {
  return node.range;
}

function getFunctionDeclarationName(node) {
  return node.id.name;
}

function isFunctionDeclaration(node) {
  return node.type === 'FunctionDeclaration'
}

function getMethodDefinitionName(node) {
  return node.key.name;
}

function isMethodDefinition(node) {
  return node.type === 'MethodDefinition';
}

function isSortedAscending(array) {
  if (array.length <= 1) {
    return true;
  }
  return array.every((item, i) => i === 0 ? true : item >= array[i - 1]);
}
