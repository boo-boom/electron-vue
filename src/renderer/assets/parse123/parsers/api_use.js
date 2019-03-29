import { trim } from './../../js/utils'

function parse(content) {
    var name = trim(content);

    if (name.length === 0)
        return null;

    return {
        name: name
    };
}

/**
 * Exports
 */
export default {
    parse        : parse,
    path         : 'local.use',
    method       : 'push',
    preventGlobal: true
};
