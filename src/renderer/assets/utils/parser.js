const fs = require('fs');
const _ = require('lodash');
const parsers = {
  api: require('../parsers/api.js'),
  apidefine: require('../parsers/api_define.js'),
  apidescription: require('../parsers/api_description.js'),
  apierror: require('../parsers/api_error.js'),
  apierrorexample: require('../parsers/api_error_example.js'),
  apiexample: require('../parsers/api_example.js'),
  apiheader: require('../parsers/api_header.js'),
  apiheaderexample: require('../parsers/api_header_example.js'),
  apigroup: require('../parsers/api_group.js'),
  apiname: require('../parsers/api_name.js'),
  apiparam: require('../parsers/api_param.js'),
  apiparamexample: require('../parsers/api_param_example.js'),
  apipermission: require('../parsers/api_permission.js'),
  apisuccess: require('../parsers/api_success.js'),
  apisuccessexample: require('../parsers/api_success_example.js'),
  apiuse: require('../parsers/api_use.js'),
  apiversion: require('../parsers/api_version.js'),
  apisamplerequest: require('../parsers/api_sample_request.js'),
  apideprecated: require('../parsers/api_deprecated.js')
};
const countDeprecated = {};

const _findBlocks = function (fileContent) {
  var blocks = [];
  var src = fileContent.replace(/\n/g, '\uffff');
  var regexForFile = {
    docBlocksRegExp: /\/\*\*\uffff?(.+?)\uffff?(?:\s*)?\*\//g,
    inlineRegExp: /^(\s*)?(\*)[ ]?/gm
  }
  var matches = regexForFile.docBlocksRegExp.exec(src);

  while (matches) {
    var block = matches[2] || matches[1];
    block = block.replace(/\uffff/g, '\n');
    block = block.replace(regexForFile.inlineRegExp, '');
    blocks.push(block);
    matches = regexForFile.docBlocksRegExp.exec(src);
  }
  return blocks;
};

const findElements = function (block, filename) {
  var elements = [];

  // Replace Linebreak with Unicode
  block = block.replace(/\n/g, '\uffff');

  // Elements start with @
  var elementsRegExp = /(@(\w*)\s?(.+?)(?=\uffff[\s\*]*@|$))/gm;
  var matches = elementsRegExp.exec(block);
  while (matches) {
    var element = {
      source: matches[1],
      name: matches[2].toLowerCase(),
      sourceName: matches[2],
      content: matches[3]
    };

    // reverse Unicode Linebreaks
    element.content = element.content.replace(/\uffff/g, '\n');
    element.source = element.source.replace(/\uffff/g, '\n');
    elements.push(element);
    // next Match
    matches = elementsRegExp.exec(block);
  }

  return elements;
};

const _findBlockWithApiGetIndex = function (blocks) {
  var foundIndexes = [];
  for (var i = 0; i < blocks.length; i += 1) {
    var found = false;
    for (var j = 0; j < blocks[i].length; j += 1) {
      // check apiIgnore
      if (blocks[i][j].name.substr(0, 9) === 'apiignore') {
        found = false;
        break;
      }

      // check app.options.apiprivate and apiPrivate
      if (blocks[i][j].name.substr(0, 10) === 'apiprivate') {
        found = false;
        break;
      }

      if (blocks[i][j].name.substr(0, 3) === 'api')
        found = true;
    }
    if (found) {
      foundIndexes.push(i);
    }
  }
  return foundIndexes;
};

const _createObjectPath = function(src, path, attachMethod) {
  if ( ! path)
      return src;
  var pathParts = path.split('.');
  var current = src;
  for (var i = 0; i < pathParts.length; i += 1) {
      var part = pathParts[i];
      if ( ! current[part]) {
          if (i === (pathParts.length - 1) && attachMethod === 'push' )
              current[part] = [];
          else
              current[part] = {};
      }
      current = current[part];
  }
  return current;
};

const _pathToObject = function(path, src) {
  if ( ! path)
      return src;
  var pathParts = path.split('.');
  var current = src;
  for (var i = 0; i < pathParts.length; i += 1) {
      var part = pathParts[i];
      current = current[part];
  }
  return current;
};

const _parseBlockElements = function (indexApiBlocks, detectedElements, filename) {
  var parsedBlocks = [];

  for (var i = 0; i < indexApiBlocks.length; i += 1) {
    var blockIndex = indexApiBlocks[i];
    var elements = detectedElements[blockIndex];
    var blockData = {
      global: {},
      local: {}
    };
    var countAllowedMultiple = 0;

    for (var j = 0; j < elements.length; j += 1) {
      var element = elements[j];
      var elementParser = parsers[element.name];

      if (!elementParser) {
        console.warn('parser plugin \'' + element.name + '\' not found in block: ' + blockIndex);
      } else {
        console.warn('found @' + element.sourceName + ' in block: ' + blockIndex);

        // Deprecation warning
        if (elementParser.deprecated) {
          countDeprecated[element.sourceName] = countDeprecated[element.sourceName] ? countDeprecated[element.sourceName] + 1 : 1;

          var message = '@' + element.sourceName + ' is deprecated';
          if (elementParser.alternative)
            message = '@' + element.sourceName + ' is deprecated, please use ' + elementParser.alternative;

          if (countDeprecated[element.sourceName] === 1)
            // show deprecated message only 1 time as warning
            console.warn(message);
          else
            // show deprecated message more than 1 time as verbose message
            console.log(message);

          console.log('in file: ' + filename + ', block: ' + blockIndex);
        }
      }

      var values;
      var preventGlobal;
      var allowMultiple;
      var pathTo;
      var attachMethod;

      try {
        // parse element and retrieve values
        values = elementParser.parse(element.content, element.source);

        // HINT: pathTo MUST be read after elementParser.parse, because of dynamic paths
        // Add all other options after parse too, in case of a custom plugin need to modify params.

        // check if it is allowed to add to global namespace
        preventGlobal = elementParser.preventGlobal === true;

        // allow multiple inserts into pathTo
        allowMultiple = elementParser.allowMultiple === true;


        // path to an array, where the values should be attached
        pathTo = '';
        if (elementParser.path) {
          if (typeof elementParser.path === 'string')
            pathTo = elementParser.path;
          else
            pathTo = elementParser.path(); // for dynamic paths
        }

        if (!pathTo)
          throw new Error('pathTo is not defined in the parser file.', '', '', element.sourceName);

        // method how the values should be attached (insert or push)
        attachMethod = elementParser.method || 'push';

        if (attachMethod !== 'insert' && attachMethod !== 'push')
          throw new Error('Only push or insert are allowed parser method values.', '', '', element.sourceName);

      } catch (e) {
        console.warn(e)
      }

      if (!values)
        throw new Error('Empty parser result.',
          filename, (blockIndex + 1), element.sourceName, element.source);

      if (preventGlobal) {
        // Check if count global namespace entries > count allowed
        // (e.g. @successTitle is global, but should co-exist with @apiErrorStructure)
        if (Object.keys(blockData.global).length > countAllowedMultiple)
          throw new Error('Only one definition or usage is allowed in the same block.',
            filename, (blockIndex + 1), element.sourceName, element.source);
      }

      // only one global allowed per block
      if (pathTo === 'global' || pathTo.substr(0, 7) === 'global.') {
        if (allowMultiple) {
          countAllowedMultiple += 1;
        } else {
          if (Object.keys(blockData.global).length > 0)
            throw new Error('Only one definition is allowed in the same block.',
              filename, (blockIndex + 1), element.sourceName, element.source);

          if (preventGlobal === true)
            throw new Error('Only one definition or usage is allowed in the same block.',
              filename, (blockIndex + 1), element.sourceName, element.source);
        }
      }

      if (!blockData[pathTo])
        _createObjectPath(blockData, pathTo, attachMethod);

      var blockDataPath = _pathToObject(pathTo, blockData);

      // insert Fieldvalues in Path-Array
      if (attachMethod === 'push')
        blockDataPath.push(values);
      else
        _.extend(blockDataPath, values);

      // insert Fieldvalues in Mainpath
      if (elementParser.extendRoot === true)
        _.extend(blockData, values);

      blockData.index = blockIndex + 1;
    }

    if (blockData.index && blockData.index > 0)
      parsedBlocks.push(blockData);
  }

  // console.log(parsedBlocks)
  return parsedBlocks;
};

// newParsers
const parser = function (filename, encoding) {
  if (typeof (encoding) === 'undefined') encoding = 'utf8';

  const _filename = filename;
  const fileContent = fs.readFileSync(_filename, { encoding });
  const blocks = _findBlocks(fileContent);
  if (blocks.length === 0) return;

  const elements = blocks.map(function (block, i) {
    const elements = findElements(block, _filename);
    return elements;
  });
  if (elements.length === 0) return;

  const indexApiBlocks = _findBlockWithApiGetIndex(elements);
  if (indexApiBlocks.length === 0) return;

  // console.log(parsers.api.parse(elements[0][0].content))
  return _parseBlockElements(indexApiBlocks, elements, _filename);
};

export default parser;
