/**
 * Created by Ari on 7/8/15.
 */

//
// Transformations
//

var config = module.exports = {
	clean: {},
	client: {},
	node: {
		js: {},
		es: {}
	},
	style: {},
	test: {},
	nodeInspector: {}
};

//
// Helpers
//
var negate = config.negate = function negate(paths) {
	var Paths = [];
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
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

	return paths.map(function(p, i, a) {
		return '!' + p;
	});
};


//
// Building
//

config.bundle = 'build/public/bundle.';

config.clean.ignore = negate([
	config.bundle + '*',
	config.bundle.replace('build/', '') + '*',
	'node_modules/**/*.*',
	'src/**/*'
]);


//
// Scripts
//
config.test.patterns = ['**/*.test.js', '**/*.test.es', '**/*.test.es6'];
config.test.ignorePatterns = negate(config.test.patterns);

config.client.files = ['public/**/*.js', 'public/**/*.es', 'public/**/*.es6'];
config.client.tests =
	config.test.patterns.map(function(p) { return 'public/' + p; });
config.client.noTests = config.client.files.concat(config.test.ignorePatterns);
config.client.vendor = ['vendor/**/*.js', 'vendor/**/*.es', 'vendor/**/*.es6'];
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

//console.log(config);