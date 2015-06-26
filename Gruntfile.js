//
// Some Config
//

//
// Bundles
//
var BUNDLE_LOCATION = 'bundle.'; // build

//
// Cleaning
//
var CLEAN_IGNORE_FILES = ['!' + BUNDLE_LOCATION + '**', '!node_modules/**', '!' + __dirname + '/test.coverage.js'];

//
// Transformations
//

var NEGATE = function NEGATE(array) {
	return array.map(function (p, i, a) {
		return '!' + p;
	});
};

//
// Scripts
//

// Tests
var TEST_NAME_PATTERNS = ['**/*.test.js', '**/test.**']; // src
var TEST_IGNORE_PATTERNS = NEGATE(TEST_NAME_PATTERNS);

// Client
var CLIENT_FILES_WITH_TESTS = ['public/**/*.js']; // build
var CLIENT_FILES_WITHOUT_TESTS = CLIENT_FILES_WITH_TESTS.concat(TEST_IGNORE_PATTERNS);
var CLIENT_TESTS = TEST_NAME_PATTERNS.map(function (p) {
	return 'public/' + p;
});
var VENDOR_FILES = ['vendor/**/*.js']; // build // All vendor files are client. All node vendor files are via NPM.
var CLIENT_FILES_WITH_VENDOR_AND_TESTS = CLIENT_FILES_WITH_TESTS.concat(VENDOR_FILES);

// Node
// Node files are all .js files that are *not* client or vendor files
var NODE_FILES_WITH_TESTS = ['**/*.js'].concat(NEGATE(CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES))); // build
var NODE_FILES_WITHOUT_TESTS = NODE_FILES_WITH_TESTS.concat(TEST_IGNORE_PATTERNS);
var NODE_TESTS = TEST_NAME_PATTERNS.concat(NEGATE(CLIENT_FILES_WITH_VENDOR_AND_TESTS));

//
// Stylesheets
//
var STYLUS_FILES = ['**/*.styl']; // build
var CSS_FILES = ['**/*.css']; // build
var ALL_STYLESHEETS = STYLUS_FILES.concat(CSS_FILES);

module.exports = function (grunt) {
	grunt.config('env', grunt.config('env') || process.env.NODE_ENV || 'production');

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
				cwd: 'src',
				src: CLIENT_FILES_WITH_VENDOR_AND_TESTS,
				dest: 'build',
				expand: true
			},
			node: {
				cwd: 'src',
				src: NODE_FILES_WITH_TESTS,
				dest: 'build',
				expand: true
			},
			stylesheets: {
				cwd: 'src',
				src: STYLUS_FILES,
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
				cwd: 'build',
				src: ALL_STYLESHEETS.concat(CLEAN_IGNORE_FILES),
				expand: true
			},
			client: {
				cwd: 'build',
				src: CLIENT_FILES_WITH_VENDOR_AND_TESTS.concat(CLEAN_IGNORE_FILES, ['vendor', 'public']),
				expand: true
			},
			node: {
				cwd: 'build',
				src: NODE_FILES_WITH_TESTS.concat(CLEAN_IGNORE_FILES),
				expand: true
			},
			nodeTests: {
				cwd: 'build',
				src: NODE_TESTS.concat(CLEAN_IGNORE_FILES),
				expand: true
			},
			clientTests: {
				cwd: 'build',
				src: CLIENT_TESTS.concat(CLEAN_IGNORE_FILES),
				expand: true
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
					cwd: 'build',
					dest: 'build',
					src: STYLUS_FILES,
					ext: '.css',
					extDot: 'last'
    			}]
			}
		},

		// Auto add vendor prefixes
		autoprefixer: {
			build: {
				expand: true,
				cwd: 'build',
				src: CSS_FILES,
				dest: 'build'
			}
		},

		// Minify and combine all the CSS files
		cssmin: {
			build: {
				// There is no way to have a dynamic source maping that has
				// Many input files to a single output. So we have to do this.
				src: CSS_FILES.map(function (file) {
					return 'build/' + file;
				}),
				dest: 'build/' + BUNDLE_LOCATION + '.css'
			}
		},

		// Uglify the JS
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: [{
					// Another bug with dynamic maping. I can't figure out how
					// to make it work in place
					src: 'build/' + BUNDLE_LOCATION + 'js',
					dest: 'build/' + BUNDLE_LOCATION + 'js',
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
				expand: true,
				cwd: 'src',
				src: ALL_STYLESHEETS,
				options: {
					tasks: ['stylesheets']
				}
			},
			client: {
				expand: true,
				cwd: 'src',
				src: CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES),
				options: {
					tasks: ['client']
				}
			},
			clientTests: {
				expand: true,
				cwd: 'src',
				src: CLIENT_FILES_WITH_TESTS,
				options: {
					tasks: ['clientTests']
				}
			},
			node: {
				expand: true,
				cwd: 'src',
				src: NODE_FILES_WITHOUT_TESTS,
				options: {
					tasks: ['node']
				}
			},
			nodeTests: {
				expand: true,
				cwd: 'src',
				src: NODE_FILES_WITH_TESTS,
				options: {
					tasks: ['nodeTests']
				}
			},
			copy: {
				src: ['**'].concat(NEGATE(
					CLIENT_FILES_WITH_VENDOR_AND_TESTS.concat(
						NODE_FILES_WITH_TESTS,
						STYLUS_FILES))),
				expand: true,
				cwd: 'src',
				options: {
					tasks: ['copy']
				}
			}
		},

		// Test the Nodecode™
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: __dirname + '/test.coverage.js'
				},
				expand: true,
				src: NODE_TESTS,
				cwd: 'src'
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage.html'
				},
				expand: true,
				src: NODE_TESTS,
				cwd: 'src'
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				expand: true,
				src: NODE_TESTS,
				cwd: 'src'
			}
		},

		// Bundle the client side JS
		browserify: {
			build: {
				src: 'build/public/js/index.js',
				dest: 'build/' + BUNDLE_LOCATION + 'js',
				browserifyOptions: {
					debug: grunt.config('env') === 'development'
				}
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
				src: NODE_FILES_WITH_TESTS.concat('../Gruntfile.js'),
				expand: true,
				cwd: 'src',
				options: {
					node: true // Some Node.js specific stuff
				}
			},
			client: {
				src: CLIENT_FILES_WITH_TESTS,
				expand: true,
				cwd: 'src',
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

	// Set the ENV
	grunt.registerTask('env', 'Sets grunt config option env to the suplied argument', function (env) {
		grunt.config('env', env);
	});

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

	grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'copy:build', 'stylesheets', 'scripts']);

	grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', ['env:development', 'build', 'watch']);
};