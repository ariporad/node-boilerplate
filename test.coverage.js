var ignorePatterns = [
	/.test.js$/,
	/test./,
	/\/public\//, // This matches /public/, but not public. This makes sure that
	// it's actually in the path, not the filename
	/\/vendor\//
];

require('blanket')({
	pattern: function (filename) {
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
	}
});