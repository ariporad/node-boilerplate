/*global chai,sinon,expect,AssertionError*/
/*eslint no-var:0, prefer-const:0*/
/*eslint-env mocha */
var ignorePatterns = [
  /.test.js$/,
  /test./,
  /\/public\//, // This matches /public/, but not public. This makes sure that
  // it's actually in the path, not the filename
  /\/vendor\//,
  /\/node_modules\//,
];

require('blanket')({
  pattern: function shouldCover(filename) {
    var ignore = false;

    if (!/src\//.test(filename)) {
      ignore = true;
    }

    ignorePatterns.forEach(function shouldIgnore(pattern) {
      if (pattern.test(filename)) {
        ignore = true;
      }
    });

    return !ignore;
  },
});
