// Same as @apiExample
var apiParser = require('./api_example.js');

/**
 * Exports
 */
export default {
    parse : apiParser.parse,
    path  : 'local.error.examples',
    method: apiParser.method
};
