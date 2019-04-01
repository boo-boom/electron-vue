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

const findElements = function (block) {
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

const insertToObject = (insertArr) => {
  const block = {};
  let _description = [];
  if(insertArr.length) {
    insertArr.forEach(item => {
      for(let key in item) {
        block[key] = item[key];
        if(item.description && key === 'description') {
          _description = JSON.parse(`{${item.description}}`);
        }
      }
    })
  }
  console.log(_description)
  return block;
};

const _parseBlockElements = function (indexApiBlocks, detectedElements, filename) {
  const parsedBlocks = [];
  const pushArr = [];
  let parsedObject = {};

  for (let i = 0; i < indexApiBlocks.length; i++) {
    const blockIndex = indexApiBlocks[i];
    const elements = detectedElements[blockIndex];

    for (let j = 0; j < elements.length; j++) {
      const element = elements[j];
      const elementParser = parsers[element.name];
      let values, pathTo;

      if(elementParser) {
        values = elementParser.parse(element.content, element.source)
        pathTo = '';
        if (elementParser.path) {
          if (typeof elementParser.path === 'string') {
            pathTo = elementParser.path;
            if(values) {
              parsedObject = {...parsedObject, ...values};
            }
          } else {
            pathTo = elementParser.path(); // for dynamic paths
            if(values) {
              parsedObject.parameterInfoList = [];
              for(let key in values) {
                // console.log(values.group)
                if(values.group == 'Parameter') {
                  console.log(values)
                  parsedObject.parameterInfoList.push(values)
                }
              }
              // console.log(values)
            }
          }
        }
      }
    }
  }
  console.log(parsedObject)
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

  return _parseBlockElements(indexApiBlocks, elements, _filename);
};

export default parser;
