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
var CLEAN_IGNORE_FILES = ['!build**bundle.**'];

//
// Transformations
//
var TO_SRC = function toSRC(array) {
	array.map(function (i) {
		i.replace('build', 'src');
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
					scripts: {
						src: CLIENT_FILES_WITH_TESTS.concat(CLEAN_IGNORE_FILES)
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

					// Lint the JS files
					jshint: {
						options: {
							lastsemic: true, // Allows function(){ return 'Something' } <-- Notice no ';' after return for single-line function
							laxcomma: true, // Allows comma-first coding
							proto: true, // Allows __proto__
						},
						node: {
							files: {
								src: ['src/**/*.js', 'Gruntfile.js', '!src/public/**', '!src/vendor/**', '!**.test.js', '!test.**']
							},
							options: {
								node: true // Some Node.js specific stuff
							}
						},
						client: {
							files: {
								src: ["src/public/js/**/*.js"]
							},
							options: {
								browser: true, // navigator and stuff, plus HTML5 APIs
								devel: true, // console.log and stuff
								jquery: true // Obvious, jQuery stuff such as $
							}
						}
					},
				});

			// load the tasks
			require('load-grunt-tasks')(grunt);

			// define the tasks
			grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets']);

			grunt.registerTask('scripts', 'Compiles the JavaScript files.', ['uglify', 'clean:scripts']);

			grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'copy', 'stylesheets', 'scripts']);

			grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', ['build', 'watch']);
		};