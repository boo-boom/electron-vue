import { trim } from './../../js/utils'

function parse(content) {
    // console.log(content)
    content = trim(content);
    // Search: type, url and title
    // Example: {get} /user/:id Get User by ID.
    var parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(.+?)(?:\s+(.+?))?$/g;
    var matches = parseRegExp.exec(content);

    if ( ! matches)
        return null;

    return {
        type : matches[1],
        url  : matches[2],
        title: matches[3] || ''
    };
}

/**
 * Exports
 */
export default {
    parse : parse,
    path  : 'local',
    method: 'insert'
};
