// Make ESLint treat this as ES5
/*eslint no-var:0, prefer-const:0, vars-on-top:0, no-unused-vars:0*/
/**
 * Created by Ari on 7/8/15.
 */

//
// Transformations
//
var config = module.exports = {};
var keys = ['dir',
            'clean',
            'client',
            'node',
            'style',
            'test',
            'nodeInspector'];

keys.forEach(function createConfigProp(key) {
  config[key] = {};
});

config.node.es = {};
config.node.js = {};

//
// Helpers
//

var makeHelper = config.makeHelper = function makeHelper(helper) {
  return function helperWrapper(paths) {
    var Paths = [];
    var arg;
    var i;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      switch (typeof arg) {
        case typeof []:
          Paths = Paths.concat(arg);
          break;
        case typeof 'string':
          Paths.push(arg);
          break;
        default:
          break;
      }
    }

    return Paths.map(helper);
  };
};

//
// Build Config
//
config.dir.dist = 'dist';
config.dir.build = 'build';
config.dir.src = 'src';
config.dir.docs = 'docs';

config.client.docs = config.dir.docs + '/client';
config.node.docs = config.dir.docs + '/node';

config.dir.node = config.node.dir = 'node';
config.dir.client = config.client.dir = 'client';

// Only bundle the client
config.bundle = config.client.bundle = config.dir.build + '/' + config.dir.client + '/bundle.';

//
// Helpers
//
var negate = config.negate = makeHelper(function mapNegate(p) {
  return '!' + p;
});

var prefixPath = config.prefixPath = function prefixPath(path) {
  return makeHelper(function mapPrefix(p) {
    return path + '/' + p;
  });
};

var toBuild = config.toBuild = prefixPath(config.dir.build);
var toSrc = config.toSrc = prefixPath(config.dir.src);
var toDist = config.toDist = prefixPath(config.dir.dist);


//
// Cleaning
//
config.clean.ignore = negate(
  config.bundle + '*',
  config.bundle.replace(config.dir.build + '/', '') + '*',
  'node_modules/**/*.*',
  config.dir.src + '/**/*'
);


//
// Scripts
//
config.test.patterns = ['**/*.test.js', '**/*.test.es', '**/*.test.es6'];
config.test.ignorePatterns = negate(config.test.patterns);

config.client.mainFile = config.dir.client + '/js/index.es6';
config.client.files =
  prefixPath(config.dir.client + '/js')(['**/*.js', '**/*.es', '**/*.es6']);
config.client.tests = prefixPath(config.client.dir)(config.test.patterns);
config.client.noTests = config.client.files.concat(config.test.ignorePatterns);
config.client.vendor = prefixPath(config.dir.client + '/vendor')(['**/*.js', '**/*.es', '**/*.es6']);
config.client.allFiles = config.client.files.concat(config.client.vendor);

config.node.ignore = negate(config.client.allFiles);

// All
config.node.files =
  ['**/*.js', '**/*.es', '**/*.es6'].concat(config.node.ignore);
config.node.tests = config.test.patterns.concat(config.node.ignore);
config.node.noTests = config.node.files.concat(config.test.ignorePatterns);

// .es(6)
config.node.es.files =
  ['**/*.es', '**/*.es6'].concat(config.node.ignore);
config.node.es.tests = config.test.patterns.concat(config.node.ignore);
config.node.es.noTests =
  config.node.es.files.concat(config.test.ignorePatterns);

// .js
config.node.js.files =
  ['**/*.js'].concat(config.node.ignore);
config.node.js.tests = config.test.patterns.concat(config.node.ignore);
config.node.js.noTests =
  config.node.js.files.concat(config.test.ignorePatterns);

//
// Stylesheets
//
config.style.stylus = ['**/*.styl'];
config.style.css = ['**/*.css'];
config.style.all = config.style.stylus.concat(config.style.css);


//
// Misc.
//
config.nodeInspector.port = 8081;
