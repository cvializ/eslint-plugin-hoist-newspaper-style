/**
 * This file provides sorting comparators for ordering arrays
 * by some predicate.
 */

function compareNullableString(a, b) {
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

module.exports = {
    compareNullableString,
};
