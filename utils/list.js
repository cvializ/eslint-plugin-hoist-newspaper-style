/**
 * This file provides utility functions for querying the state
 * of arrays.
 */

function isSortedAscending(array) {
    if (array.length <= 1) {
        return true;
    }
    return array.every((item, i) => i === 0 ? true : item >= array[i - 1]);
}

module.exports = {
    isSortedAscending,
};
