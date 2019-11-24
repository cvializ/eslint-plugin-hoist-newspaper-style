
function getLastMatch(text, regex) {
    let results = null;
    let matches;
    while (matches = regex.exec(text)) {
        results = matches[1];
    }
    return results;
}

module.exports = {
    getLastMatch,
};
