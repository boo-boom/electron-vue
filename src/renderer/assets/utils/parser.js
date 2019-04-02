var _       = require('lodash');
var fs      = require('fs-extra');
var apidoc  = require('apidoc-core');
var path    = require('path');
var winston = require('winston');

var defaults = {
  src       : path.resolve(__dirname, '../example'),
  dest      : path.resolve(__dirname, '../apiDoc'),
  debug     : false,
  silent    : false,
  verbose   : false,
  simulate  : false,
  colorize  : true,
  apiprivate: false,
  encoding  : 'utf8'
};

var app = {
  log           : {},
  markdownParser: null,
  options       : {}
};

function createDoc(options) {
  var api;

  options = _.defaults({}, options, defaults);

  // Line-Ending.
  if (options.lineEnding) {
    if (options.lineEnding === 'CRLF')
      options.lineEnding = '\r\n'; // win32
    else if (options.lineEnding === 'CR')
      options.lineEnding = '\r'; // darwin
    else
      options.lineEnding = '\n'; // linux
  }

  // Options.
  app.options = options;

  // Logger.
  app.log = winston.createLogger({
    transports: [
      new (winston.transports.Console)({
        level      : app.options.debug ? 'debug': app.options.verbose ? 'verbose': 'info',
        silent     : app.options.silent,
        prettyPrint: true,
        colorize   : app.options.colorize,
        timestamp  : false
      }),
    ]
  });

  try {
    apidoc.setLogger(app.log);

    api = apidoc.parse(app.options);

    if (api === true) {
      app.log.info('Nothing to do.');
      return true;
    }
    if (api === false)
      return false;

    if (app.options.parse !== true)
      createOutputFiles(api);
    app.log.info('Done.');
    return api;
  } catch (e) {
    app.log.error(e.message);
    if (e.stack)
      app.log.debug(e.stack);
    return false;
  }
}

function createOutputFiles(api) {
  // console.log(api)
  if (app.options.simulate)
    app.log.warn('!!! Simulation !!! No file or dir will be copied or created.');

  app.log.verbose('create dir: ' + app.options.dest);
  if (!app.options.simulate)
    fs.mkdirsSync(app.options.dest);

  // Write api_data
  app.log.verbose('write json file: ' + app.options.dest + 'api_data.json');
  if (!app.options.simulate)
    fs.writeFileSync(app.options.dest + '/api_data.json', api.data + '\n');

}

module.exports = {
  createDoc
};
