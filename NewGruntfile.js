//
// Some Config
//

//
// Bundles
//
var BUNDLE_LOCATION = 'build/bundle.';

//
// Cleaning
//
var CLEAN_IGNORE_FILES = ['!' + BUNDLE_LOCATION + '**'];

//
// Transformations
//
var TO_SRC = function toSRC(array) {
	array.map(function (i) {
		i.replace('build/', '');
		return 'src/' + i;
	});
};

var NEGATE = function NEGATE(array) {
	array.map(function (p) {
		return '!' + p;
	});
};

//
// Scripts
//

// Tests
var TEST_NAME_PATTERNS = ['**.test.js', '**test.**'];
var TEST_IGNORE_PATTERNS = NEGATE(TEST_NAME_PATTERNS);

// Client
var CLIENT_FILES_WITH_TESTS = ['build/public/**.js'];
var CLIENT_FILES_WITHOUT_TESTS = CLIENT_FILES_WITH_TESTS.concat(TEST_IGNORE_PATTERNS);
var VENDOR_FILES = ['build/vendor/**.js']; // All vendor files are client. All node vendor files are via NPM.
var CLIENT_FILES_WITH_VENDOR_AND_TESTS = CLIENT_FILES_WITH_TESTS.concat(VENDOR_FILES);

// Node
// Node files are all .js files that are *not* client or vendor files
var NODE_FILES_WITH_TESTS = ['build/**.js'].concat(NEGATE(CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES)));
var NODE_FILES_WITHOUT_TESTS = NODE_FILES_WITH_TESTS.concat(TEST_IGNORE_PATTERNS);
var NODE_TESTS = TO_SRC(TEST_NAME_PATTERNS.concat(NEGATE(CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES))))

//
// Stylesheets
//
var STYLUS_FILES = ['build/**.styl'];
var CSS_FILES = ['build/**.css'];
var ALL_STYLESHEETS = STYLUS_FILES.concat(CSS_FILES);

module.exports = function (grunt) {

	// configure the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Copy files from src to build
		// It's a very concious design decision to copy everything here, and 
		// do all of everything in build/. It clearly sperates the build and
		// the source. You'll notice that even the patterns are only for build
		// as there is no need to every do anything in src/.
		copy: {
			build: {
				cwd: 'src',
				src: ['**'],
				dest: 'build',
				expand: true
			},
			client: {
				src: TO_SRC(CLIENT_FILES_WITH_VENDOR_AND_TESTS),
				dest: 'build',
				expand: true
			},
			nodeTests: {
				src: TO_SRC(NODE_TESTS),
				dest: 'build',
				expand: true
			},
			node: {
				src: TO_SRC(NODE_FILES_WITH_TESTS),
				dest: 'build',
				expand: true
			},
			stylesheets: {
				src: TO_SRC(STYLUS_FILES),
				dest: 'build',
				expand: true
			}
		},

		// Clean the build dir
		clean: {
			build: {
				src: ['build']
			},
			stylesheets: {
				src: ALL_STYLESHEETS.concat(CLEAN_IGNORE_FILES)
			},
			client: {
				src: CLIENT_FILES_WITH_VENDOR_AND_TESTS.concat(CLEAN_IGNORE_FILES)
			},
			node: {
				src: TEST_NAME_PATTERNS.concat(NEGATE(CLIENT_FILES_WITH_VENDOR_AND_TESTS), CLEAN_IGNORE_FILES)
			},
			tests: {
				src: TEST_NAME_PATTERNS.concat(CLEAN_IGNORE_FILES)
			}
		},

		// Compile the Styl(us)
		stylus: {
			build: {
				options: {
					linenos: true,
					compress: false
				},
				files: [{
					expand: true,
					//cwd: 'build',
					src: STYLUS_FILES,
					//dest: 'build',
					ext: '.css'
    			}]
			}
		},

		// Auto add vendor prefixes
		autoprefixer: {
			build: {
				expand: true,
				//				cwd: 'build',
				src: CSS_FILES,
				//				dest: 'build'
			}
		},

		// Minify and combine all the CSS files
		cssmin: {
			build: {
				files: [{
					src: CSS_FILES,
					dest: BUNDLE_LOCATION + '.css'
				}]
			}
		},

		// Uglify the JS
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: [{
					src: CLIENT_FILES_WITHOUT_TESTS,
					dest: BUNDLE_LOCATION + '.js'
				}]
			}
		},

		// Watch for changes
		watch: {
			livereload: {
				options: {
					livereload: true
				},
				files: [
      'src/public/**/*.{styl,css,js}',
      'views/**/*.*'
    ]
			},
			stylesheets: {
				files: TO_SRC(ALL_STYLESHEETS),
				tasks: ['stylesheets']
			},
			client: {
				files: TO_SRC(CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES)),
				tasks: ['client']
			},
			clientTests: {
				files: TO_SRC(CLIENT_FILES_WITH_TESTS),
				tasks: ['clientTests']
			},
			node: {
				files: TO_SRC(NODE_FILES_WITHOUT_TESTS),
				tasks: ['node']
			},
			nodeTests: {
				files: TO_SRC(NODE_FILES_WITH_TESTS),
				tasks: ['nodeTests']
			},
			copy: {
				files: ['src/**'].concat(NEGATE(TO_SRC(
							[].concat( // Join eveything into one array
							CLIENT_FILES_WITH_VENDOR_AND_TESTS,
							NODE_FILES_WITH_TESTS,
							STYLUS_FILES))),
					tasks: ['copy']
				}
			},
		},

		// Test the Nodecode™
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: 'test.coverage.js'
				},
				src: NODE_TESTS
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage.html'
				},
				src: NODE_TESTS
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: NODE_TESTS
			}
		},

		// Lint the JS files
		jshint: {
			options: {
				lastsemic: true, // Allows function(){ return 'Something' } <-- Notice no ';' after return for single-line function
				laxcomma: true, // Allows comma-first coding
				proto: true, // Allows __proto__
			},
			node: {
				files: {
					src: TO_SRC(NODE_FILES_WITH_TESTS).concat('Gruntfile.js')
				},
				options: {
					node: true // Some Node.js specific stuff
				}
			},
			client: {
				files: {
					src: TO_SRC(CLIENT_FILES_WITH_TESTS)
				},
				options: {
					browser: true, // navigator and stuff, plus HTML5 APIs
					devel: true, // console.log and stuff
					jquery: true // Obvious, jQuery stuff such as $
				}
			}
		},

		// Watch the code, start the server
		concurrent: {
			dev: {
				options: {
					logConcurrentOutput: true
				},
				tasks: ['watch', 'nodemon:dev']
			}
		},

		// Automagiaclly restart the server when something changes.
		nodemon: {
			dev: {
				options: {
					file: 'build/index.js'
				}
			}
		}
	});

	// load the tasks
	require('load-grunt-tasks')(grunt);

	//
	// Tasks
	//

	// Stylesheets
	grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['copy:stylesheets', 'stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets']);

	// Node
	grunt.registerTask('node', 'Compiles the JavaScript files.', ['clean:node', 'copy:node', 'jshint:node', 'clean:nodeTests']);
	grunt.registerTask('nodeTest', 'Compiles the JavaScript files.', ['jshint:node', 'mochaTest']);

	// Client
	grunt.registerTask('client', 'Compiles the JavaScript files.', ['clean:client', 'copy:client', 'jshint:client', 'browserify', 'uglify', 'clean:client']);
	grunt.registerTask('clientTest', 'Compiles the JavaScript files.', ['jshint:client']);

	grunt.registerTask('scripts', 'Compiles the JavaScript files.', ['node', 'client']);

	grunt.registerTask('test', 'Tests all the code', ['nodeTest', 'clientTest']);

	grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'copy', 'stylesheets', 'scripts']);

	grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', ['build', 'watch']);
};