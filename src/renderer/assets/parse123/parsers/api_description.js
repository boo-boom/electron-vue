import { trim, unindent } from './../../js/utils'

function parse(content) {
    var description = trim(content);

    if (description.length === 0)
        return null;

    return {
        description: unindent(description)
    };
}

/**
 * Exports
 */
export default {
    parse         : parse,
    path          : 'local',
    method        : 'insert',
    markdownFields: [ 'description' ]
};
