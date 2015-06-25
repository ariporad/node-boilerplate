var path = require('path');
var ignorePatterns = [
	/.test.js$/,
	/test./,
	/\/public\//, // This matches /public/, but not public. This makes sure that it's actually in the path, not the filename
	/\/vendor\//
];

require('blanket')({
	pattern: function (filename) {
		if (!/src\//.test(filename)) return false;

		ignorePatterns.forEach(function shouldIgnore(pattern) {
			if (pattern.test(filename)) return false;
		});
	}
});