import { trim } from './../../assets/js/utils'

const parse = (content) => {
    content = trim(content);

    // Search: type, url and title
    // Example: {get} /user/:id Get User by ID.
    var parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(.+?)(?:\s+(.+?))?$/g;
    var matches = parseRegExp.exec(content);
    console.log(matches)
    if ( ! matches)
        return null;

    return {
        type : matches[1],
        url  : matches[2],
        title: matches[3] || ''
    };
}

export default parse;
