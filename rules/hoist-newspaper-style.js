/**
 * These rules ensure that hoistable functions are below all calls or other
 * reference to those functions. This is known as "newspaper" style.
 *
 * For all function calls, there should be no reference to that function below its definition.
 * - We have a function declaration
 * - We know it is referenced
 * - We find the last call that reference it.
 * - We move the function to the first point in its start scope after the last reference.
 *
 * Possible next features:
 * - Add config option to ensure the definition is after the first reference
 * - Add config option to allow the function to be defined before references but not calls.
 * - Make sure it plays nice with other eslint rules, like no-use-before-define?
 */

const {
  getIdentifierReferences,
  getSiblingFrom,
  isEveryNodeAboveNode,
  getClassMethodDefinitionReferences,
  getLatestNode,
} = require('../utils/estree');
const {
  getLastMatch,
} = require('../utils/string');

module.exports = {
  create: function(context) {
    return {
      FunctionDeclaration: (node) => hoistFunctionDeclaration(context, node),
      MethodDefinition: (node) => hoistMethodDefinition(context, node),
    };
  },
};

function hoistFunctionDeclaration(context, node) {
  const declarationScope = context.getScope();
  // We get the upper scope since declarationScope only includes variables
  // available inside the FunctionDeclaration we are currently visiting.
  const upperScope = declarationScope.upper;

  const references = getIdentifierReferences(upperScope, node.id);
  if (references.length === 0) {
    return;
  }

  const referenceIdentifiers =
      references.map(reference => reference.identifier);
  if (!isEveryNodeAboveNode(referenceIdentifiers, node.id)) {
    reportHoist(context, node, references);
  }

  function reportHoist(context, node, references) {
    context.report({
      node,
      message: `FunctionDeclaration ${node.id.name} found above reference.`,
      fix: (fixer) => {
        const latestReference = getLatestNode(references);
        // Go up the tree until we get to the element that shares the same
        // block as the latest reference.
        const sibling = getSiblingFrom(node, latestReference.identifier);
        const siblingText = context.getSource(sibling);
        const whitespaceRe = /\n(\s+)./g;
        const lastLineIndent = getLastMatch(siblingText, whitespaceRe) || '';
        const nodeText = '\n' + lastLineIndent + context.getSource(node);
        return [
          fixer.remove(node),
          fixer.insertTextAfter(sibling, nodeText),
        ];
      }
    })
  }
}


function hoistMethodDefinition(context, node) {
  const references = getClassMethodDefinitionReferences(node);
  if (references.length === 0) {
    return;
  }

  if (!isEveryNodeAboveNode(references, node)) {
    context.report({
      node,
      message: `MethodDefinition ${node.key.name} found above reference.`,
      fix: (fixer) => {
        const latestReference = getLatestNode(references);
        // Get last reference node
        // Move the method definition below the last reference
        const sibling = getSiblingFrom(node, latestReference);
        const siblingText = context.getSource(sibling);
        const whitespaceRe = /\n(\s+)./g;
        const lastLineIndent = getLastMatch(siblingText, whitespaceRe) || '';
        const nodeText = '\n' + lastLineIndent + context.getSource(node);
        return [
          fixer.remove(node),
          fixer.insertTextAfter(sibling, nodeText),
        ];
      }
    })
  }
}

