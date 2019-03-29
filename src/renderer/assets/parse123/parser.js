const fs = require('fs');
const path = require('path');
const _ = require('lodash');
let parsers = {
  api                      : './parsers/api.js',
  // apidefine                : './parsers/api_define.js',
  // apidescription           : './parsers/api_description.js',
  // apierror                 : './parsers/api_error.js',
  // // apierrorexample          : './parsers/api_error_example.js',
  // // apiexample               : './parsers/api_example.js',
  // // apiheader                : './parsers/api_header.js',
  // // apiheaderexample         : './parsers/api_header_example.js',
  // // apigroup                 : './parsers/api_group.js',
  // // apiname                  : './parsers/api_name.js',
  // // apiparam                 : './parsers/api_param.js',
  // // apiparamexample          : './parsers/api_param_example.js',
  // // apipermission            : './parsers/api_permission.js',
  // // apisuccess               : './parsers/api_success.js',
  // // apisuccessexample        : './parsers/api_success_example.js',
  // // apiuse                   : './parsers/api_use.js',
  // // apiversion               : './parsers/api_version.js',
  // // apisamplerequest         : './parsers/api_sample_request.js',
  // // apideprecated            : './parsers/api_deprecated.js'
};
let newParsers = {}

const _findBlocks = function(fileContent) {
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

const findElements = function(block, filename) {
  var elements = [];

  // Replace Linebreak with Unicode
  block = block.replace(/\n/g, '\uffff');

  // Elements start with @
  var elementsRegExp = /(@(\w*)\s?(.+?)(?=\uffff[\s\*]*@|$))/gm;
  var matches = elementsRegExp.exec(block);
  while (matches) {
      var element = {
          source    : matches[1],
          name      : matches[2].toLowerCase(),
          sourceName: matches[2],
          content   : matches[3]
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

const _findBlockWithApiGetIndex = function(blocks) {
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

const _parseBlockElements = function(indexApiBlocks, detectedElements, filename) {
  var self = this;
  var parsedBlocks = [];

  for (var i = 0; i < indexApiBlocks.length; i += 1) {
      var blockIndex = indexApiBlocks[i];
      var elements = detectedElements[blockIndex];
      var blockData = {
          global: {},
          local : {}
      };
      var countAllowedMultiple = 0;

      for (var j = 0; j < elements.length; j += 1) {
          var element = elements[j];
          var elementParser = _parsers[element.name];
          console.log(_parsers)
      }
  }
  return parsedBlocks;
};

const addParser = function(name, parser) {
  parsers[name] = parser;
  console.log( parsers[name] )
};
// newParsers
const parser = function(filename, encoding) {
  const _parsers = Object.keys(parsers);
  _parsers.forEach(async function(parser) {
    // newParsers[parser] = require(parsers[parser]);
    let url = parsers[parser]
    console.log(require(url).default)
    // newParsers[parser] = require(url).default;
  });
  // console.log(newParsers)

  if (typeof(encoding) === 'undefined') encoding = 'utf8';

  const _filename = filename;
  const extension = path.extname(_filename).toLowerCase();
  const fileContent = fs.readFileSync(_filename, { encoding });
  const blocks = _findBlocks(fileContent);
  if (blocks.length === 0) return;

  const elements = blocks.map(function(block, i) {
    const elements = findElements(block, _filename);
    return elements;
  });
  if (elements.length === 0) return;

  const indexApiBlocks = _findBlockWithApiGetIndex(elements);
  if (indexApiBlocks.length === 0) return;

  // console.log(JSON.stringify(indexApiBlocks))
  // _parseBlockElements(indexApiBlocks, elements, _filename);

  // console.log(fileContent)

  // self.blocks = [];
  // self.indexApiBlocks = [];

  // determine blocks
  // self.blocks = self._findBlocks();
  // console.log(self.blocks)
  // if (self.blocks.length === 0)
  //     return;

  // determine elements in blocks
  // self.elements = self.blocks.map(function(block, i) {
  //     var elements = self.findElements(block, filename);
  //     console.log('count elements in block ' + i + ': ' + elements.length);
  //     return elements;
  // });
  // if (self.elements.length === 0)
  //     return;

  // determine list of blocks with API elements
  // self.indexApiBlocks = self._findBlockWithApiGetIndex(self.elements);
  // if (self.indexApiBlocks.length === 0)
  //     return;


  // return self._parseBlockElements(self.indexApiBlocks, self.elements, filename);
};

export default parser;
