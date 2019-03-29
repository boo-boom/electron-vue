import { trim } from './../../js/utils'

function parse(content) {
  var group = trim(content);

  if (group.length === 0)
    return null;

  return {
    group: group.replace(/(\s+)/g, '_')
  };
}

/**
 * Exports
 */
export default {
  parse: parse,
  path: 'local',
  method: 'insert'
};
