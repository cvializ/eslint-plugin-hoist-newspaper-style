const hoistAlphabetical = require('../rules/hoist-alphabetical');
const hoistNewspaperStyle = require('../rules/hoist-alphabetical');

module.exports = {
    "rules": {
        "hoist-alphabetical": hoistAlphabetical,
        "hoist-newspaper-style": hoistNewspaperStyle,
    }
}
