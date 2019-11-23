module.exports = {
  create: function(context) {
      return {
        FunctionDeclaration: (node) => {
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
        },
      };
  }
}

function compare(a, b) {
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

function isSortedAscending(array) {
  if (array.length <= 1) {
    return true;
  }
  return array.every((item, i) => i === 0 ? true : item >= array[i - 1]);
}
