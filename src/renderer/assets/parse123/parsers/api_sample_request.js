import { trim } from './../../js/utils'

function parse(content) {
    var url = trim(content);

    if(url.length === 0)
        return null;

    return {
        url: url
    };
}

/**
 * Exports
 */
export default {
    parse : parse,
    path  : 'local.sampleRequest',
    method: 'push'
};
