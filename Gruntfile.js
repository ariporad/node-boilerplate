//
// Some Config
//

//
// Bundles
//
var BUNDLE_LOCATION = 'build/bundle.'; // build

//
// Cleaning
//
// We have both !build/bundle.**, and !bundle.**
var CLEAN_IGNORE_FILES = ['!' +
                          BUNDLE_LOCATION +
                          '**',
                          '!' +
                          BUNDLE_LOCATION.replace('build/', '') +
                          '**',
                          '!node_modules/**',
                          '!' +
                          __dirname +
                          '/test.coverage.js'];

//
// Transformations
//

var NEGATE = function NEGATE(array) {
	return array.map(function(p, i, a) {
		return '!' + p;
	});
};

//
// Scripts
//

// Tests
var TEST_NAME_PATTERNS = ['**/*.test.js']; // src
var TEST_IGNORE_PATTERNS = NEGATE(TEST_NAME_PATTERNS);

// Client
var CLIENT_FILES_WITH_TESTS = ['public/**/*.js']; // build
var CLIENT_FILES_WITHOUT_TESTS = CLIENT_FILES_WITH_TESTS
	.concat(TEST_IGNORE_PATTERNS);
var CLIENT_TESTS = TEST_NAME_PATTERNS
	.map(function(p) {
		     return 'public/' + p;
	     });
var VENDOR_FILES = ['vendor/**/*.js']; // build // All vendor files are client.
                                       // All node vendor files are via NPM.
var CLIENT_FILES_WITH_VENDOR_AND_TESTS = CLIENT_FILES_WITH_TESTS
	.concat(VENDOR_FILES);

// Node
// Node files are all .js files that are *not* client or vendor files
var NODE_FILES_WITH_TESTS = ['**/*.js']
	.concat(NEGATE(CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES))); // build
var NODE_FILES_WITHOUT_TESTS = NODE_FILES_WITH_TESTS
	.concat(TEST_IGNORE_PATTERNS);
var NODE_TESTS = TEST_NAME_PATTERNS
	.concat(NEGATE(CLIENT_FILES_WITH_VENDOR_AND_TESTS));

//
// Stylesheets
//
var STYLUS_FILES = ['**/*.styl']; // build
var CSS_FILES = ['**/*.css']; // build
var ALL_STYLESHEETS = STYLUS_FILES.concat(CSS_FILES);


//
// Other Tasks
//
var NODE_INSPECTOR_PORT = 8081;



module.exports = function(grunt) {
	grunt.config('env',
	             grunt.config('env') ||
	             process.env.NODE_ENV ||
	             'production');

	grunt.config('sourcemaps', grunt.config('env') === 'development');

	// configure the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//
		// Build Setup
		//

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
				src: CLIENT_FILES_WITH_VENDOR_AND_TESTS
					.concat(CLEAN_IGNORE_FILES,
					['vendor',
					 'public']),
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

		//
		// Stylesheets
		//

		// Compile the Styl(us)
		stylus: {
			build: {
				options: {
					sourcemap: (grunt.config('sourcemaps')) ? {
						inline: true
					} : false
				},
				src: ALL_STYLESHEETS.map(function(file) {
					return 'build/' + file;
				}),
				dest: BUNDLE_LOCATION + 'css'
			}
		},

		// CSS Postproccessing
		postcss: {
			options: {
				map: grunt.config('sourcemaps'), // inline sourcemaps

				processors: [
					require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer-core')({
						browsers: '> 5%'
					}), // add vendor prefixes
//        			require('cssgrace'),
					require('postcss-font-family')(),
					require('cssnano')() // minify the result
				]
			},
			build: {
				expand: true,
				src: '**/*.css',
				cwd: 'build',
				dest: 'build'
			}
		},

		//
		// Build the JavaScript
		//

		// Bundle the client side JS
		browserify: {
			build: {
				src: 'build/public/js/index.js',
				dest: BUNDLE_LOCATION + 'js',
				options: {
					browserifyOptions: {
						debug: (grunt.config('env') === 'development')
					},
					transform: ['uglifyify']
				}
			}
		},

		//
		// Testing
		//

		// Lint the JS files
		jshint: {
			options: {
				lastsemic: true, // Allows function(){ return 'Something' } <--
			                     // Notice no ';' after return for single-line
			                     // function
				laxcomma: true, // Allows comma-first coding
				proto: true // Allows __proto__
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

		// Test the Nodecode™
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: './test.setup.js'
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

		//
		// Dev
		//

		// Watch the code, start the server
		concurrent: {
			dev: {
				options: {
					logConcurrentOutput: true
				},
				tasks: ['watch',
				        'nodemon:dev',
				        'node-inspector:dev',
				        'open:node-inspector',
				        'open:dev']
			}
		},

		// Automagiaclly restart the server when something changes.
		nodemon: {
			dev: {
				options: {
					file: 'build/main.js',
					nodeArgs: ['--debug'],
					env: {}
				}
			}
		},

		// Debug Nodecode™
		'node-inspector': {
			dev: {
				options: {
					'web-port': NODE_INSPECTOR_PORT,
					'save-live-edit': true,
					'hidden': ['node_modules']
				}
			}
		},

		// Auto open the browser
		open: {
			options: {
				delay: 10 // Rough count/guess as to the startup time needed.
			},
			'node-inspector': {
				path: 'http://localhost:8081',
				app: 'Google Chrome'
			},
			dev: {
				path: 'http://localhost:8080/',
				app: 'Google Chrome'
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
				files: {
					expand: true,
					cwd: 'src',
					src: ALL_STYLESHEETS
				},
				options: {
					tasks: ['stylesheets']
				}
			},
			client: {
				files: {
					expand: true,
					cwd: 'src',
					src: CLIENT_FILES_WITHOUT_TESTS.concat(VENDOR_FILES)
				},
				options: {
					tasks: ['client']
				}
			},
			clientTests: {
				files: {
					expand: true,
					cwd: 'src',
					src: CLIENT_FILES_WITH_TESTS
				},
				options: {
					tasks: ['clientTests']
				}
			},
			node: {
				files: {
					expand: true,
					cwd: 'src',
					src: NODE_FILES_WITHOUT_TESTS
				},
				options: {
					tasks: ['node']
				}
			},
			nodeTests: {
				files: {
					expand: true,
					cwd: 'src',
					src: NODE_FILES_WITH_TESTS
				},
				options: {
					tasks: ['nodeTests']
				}
			},
			copy: {
				files: {
					src: ['**'].concat(NEGATE(
						CLIENT_FILES_WITH_VENDOR_AND_TESTS.concat(
							NODE_FILES_WITH_TESTS,
							STYLUS_FILES))),
					expand: true,
					cwd: 'src'
				},
				options: {
					tasks: ['copy']
				}
			}
		},
	});

	// load the plugins
	require('load-grunt-tasks')(grunt);

	//
	// Tasks
	//

	// Set the ENV
	grunt.registerTask('env',
	                   'Sets grunt config option env to the suplied argument',
	                   function(env) {
		                   grunt.config('env', env);
	                   });

	// Stylesheets
	grunt.registerTask('stylesheets',
	                   'Compiles the stylesheets.',
		['copy:stylesheets',
		 'stylus',
		 'postcss',
		 'clean:stylesheets']);

	// Node
	grunt.registerTask('node',
	                   'Compiles the JavaScript files.',
		['clean:node',
		 'copy:node',
		 'jshint:node',
		 'clean:nodeTests']);
	grunt.registerTask('nodeTest',
	                   'Compiles the JavaScript files.',
		['jshint:node',
		 'mochaTest']);

	// Client
	grunt.registerTask('client',
	                   'Compiles the JavaScript files.',
		['clean:client',
		 'copy:client',
		 'jshint:client',
		 'browserify',
		 'clean:client']);
	grunt.registerTask('clientTest',
	                   'Compiles the JavaScript files.',
		['jshint:client']);

	grunt.registerTask('scripts',
	                   'Compiles the JavaScript files.',
		['node',
		 'client']);

	grunt.registerTask('test',
	                   'Tests all the code',
		['nodeTest',
		 'clientTest']);

	grunt.registerTask('build',
	                   'Compiles all of the assets and copies the files to ' +
	                   'the build directory.',
		['clean:build',
		 'copy:build',
		 'stylesheets',
		 'scripts']);

	grunt.registerTask('default', 'Runs the dev task', ['dev']);
	grunt.registerTask('dev',
	                   'Watches the project for changes, automatically builds' +
	                   ' them and runs a server.',
		['env:development',
		 'build',
		 'concurrent:dev']);
};