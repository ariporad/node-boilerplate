module.exports = function (grunt) {

	// configure the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Copy files from src to build
		copy: {
			build: {
				cwd: 'src',
				src: ['**'],
				dest: 'build',
				expand: true
			},
		},

		// Clean the build dir
		clean: {
			build: {
				src: ['build']
			},
			stylesheets: {
				src: ['build/**/*.css', 'build/**/*.styl', '!build/bundle.css']
			},
			scripts: {
				src: ['build/**/*.js', '!build/bundle.js']
			},
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
					src: ['**/*.styl'],
					dest: 'build',
					ext: '.css'
    			}]
			}
		},

		// Auto add vendor prefixes
		autoprefixer: {
			build: {
				expand: true,
				cwd: 'build',
				src: ['**/*.css'],
				dest: 'build'
			}
		},

		// Minify and combine all the CSS files
		cssmin: {
			build: {
				files: {
					'build/bundle.css': ['build/**/*.css']
				}
			}
		},

		// Uglify the JS
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: {
					'build/bundle.js': ['build/**/*.js']
				}
			}
		},

		// Watch for changes
		watch: {
			stylesheets: {
				files: 'src/**/*.styl',
				tasks: ['stylesheets']
			},
			scripts: {
				files: 'src/**/*.js',
				tasks: ['scripts']
			},
			copy: {
				files: ['src/**', '!src/**/*.styl', '!src/**/*.js'],
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