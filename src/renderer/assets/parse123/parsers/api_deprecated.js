import { trim, unindent } from './../../js/utils'

function parse(content) {
  var deprecated = trim(content);

  if (deprecated.length > 0) {
    return {
      deprecated: {
        content: unindent(deprecated)
      }
    };
  }

  return {
    deprecated: true
  };
}

/**
 * Exports
 */
export default {
  parse : parse,
  path  : 'local',
  method: 'insert',
  markdownFields: [ 'deprecated.content' ],
  markdownRemovePTags: [ 'deprecated.content' ]
};
