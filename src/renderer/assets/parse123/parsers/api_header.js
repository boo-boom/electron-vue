// Same as @apiParam
var apiParser = require('./api_param.js');

function parse(content, source) {
  return apiParser.parse(content, source, 'Header');
}

function path() {
  return 'local.header.fields.' + apiParser.getGroup();
}

/**
 * Exports
 */
export default {
  parse: parse,
  path: path,
  method: apiParser.method,
  markdownFields: ['description']
};
