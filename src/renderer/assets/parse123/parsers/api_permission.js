// Same as @apiUse
var apiParser = require('./api_use.js');

/**
 * Exports
 */
export default {
    parse        : apiParser.parse,
    path         : 'local.permission',
    method       : apiParser.method,
    preventGlobal: true
};
