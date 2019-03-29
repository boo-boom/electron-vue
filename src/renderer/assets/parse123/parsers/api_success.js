// Same as @apiParam
var apiParser = require('./api_param.js');

function parse(content, source) {
    return apiParser.parse(content, source, 'Success 200');
}

function path() {
    return 'local.success.fields.' + apiParser.getGroup();
}

/**
 * Exports
 */
export default {
    parse         : parse,
    path          : path,
    method        : apiParser.method,
    markdownFields: [ 'description', 'type' ],
    markdownRemovePTags: [ 'type' ]
};
