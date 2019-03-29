import { trim } from './../../js/utils'

function parse(content) {
  var name = trim(content);

  if (name.length === 0)
    return null;

  return {
    name: name.replace(/(\s+)/g, '_')
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
