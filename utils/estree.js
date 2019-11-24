/**
 * This file contains selector-like utilities for
 * querying ESTree nodes
 * https://github.com/estree/estree/blob/master/es5.md
 * https://github.com/estree/estree/blob/master/es2015.md
 */
const walk = require('estree-walk');

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

function getIdentifierReferences(scope, identifier) {
    const { variables } = scope;
    for (let i = 0; i < variables.length; i++) {
        const variable = variables[i];
        const { identifiers } = variable;
        for (let j = 0; j < identifiers.length; j++) {
            const scopeIdentifier = identifiers[j];
            if (identifierIsEqual(identifier, scopeIdentifier)) {
                const { references } = variable;
                return references;
            }
        }
    }
    return [];
}

function getSiblingFrom(child, node) {
    const { parent } = child;
    let currentNode = node;
    while (currentNode && currentNode.parent !== parent) {
        currentNode = currentNode.parent;
    }
    return currentNode;
}

function isEveryNodeAboveNode(nodes, b) {
    return nodes.every(n => n.end <= b.start);
}

function getClassMethodDefinitionReferences(methodDefinitionNode) {
    const references = [];

    const methodName = methodDefinitionNode.key.name;
    walk(methodDefinitionNode.parent, {
        MemberExpression: (memberExpression) => {
            const matches = (
                memberExpression.object.type === 'ThisExpression' &&
                memberExpression.property.name === methodName
            );
            if (matches) {
                references.push(memberExpression);
            }
        }
    });

    return references;
}

function getLatestNode(nodes) {
    return nodes.reduce((ref, acc) => node.end > node.end ? acc : ref);
}

module.exports = {
    getFunctionDeclarationName,
    getMethodDefinitionName,
    getNodeRange,
    isFunctionDeclaration,
    isMethodDefinition,
    getIdentifierReferences,
    getSiblingFrom,
    isEveryNodeAboveNode,
    getClassMethodDefinitionReferences,
    getLatestNode,
};

// Not exported

function getIdentifierName(identifier) {
    return identifier.name;
}

function identifierIsEqual(a, b) {
    // Do we need to check name here?
    return a === b || (a.start == b.start && a.end === b.end);
}
