var semver = require('semver');

var trim = require('../utils/trim');

function parse(content) {
    content = trim(content);

    if (content.length === 0)
        return null;

    if ( ! semver.valid(content))
        throw new Error('Version format not valid.',
                                 'apiVersion', '@apiVersion major.minor.patch', '@apiDefine 1.2.3');

    return {
        version: content
    };
}

/**
 * Exports
 */
module.exports = {
    parse     : parse,
    path      : 'local',
    method    : 'insert',
    extendRoot: true
};
