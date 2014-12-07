module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '<%= pkg.name %> Built on <%= grunt.template.today("mm-dd-yyyy") %>. ©2014 <%= pkg.author %>', // This banner is appended to all minified/compiled files
		uglify: {
			options: {
				banner: '/*! <%= banner %> */\n'
			},
			build: {
				expand: true,     // Enable dynamic expansion.
				cwd: 'src/js/',      // Src matches are relative to this path.
				src: ['**/*.js'], // Actual pattern(s) to match.
				dest: 'build/public/js/',   // Destination path prefix.
				ext: '.js',   // Dest filepaths will have this extension.
				extDot: 'last'
			}
		},
		stylus: {
			compile: {
				options:{
					banner: '/*! <%= banner %> */'
				},
				files: [{
					expand: true,     // Enable dynamic expansion.
					cwd: 'src/stylus',      // Src matches are relative to this path.
					src: ['*.styl', '**/*.styl'], // Actual pattern(s) to match.
					dest: 'build/public/css',   // Destination path prefix.
					ext: '.css',   // Dest filepaths will have this extension.
					extDot: 'first'
				}]
			}
		},
		jshint: {
			options: {
				eqnull: true, // Allows == null
				lastsemic: true, // Allows function(){ return 'Something' } <-- Notice no ';' after return for single-line function
				laxcomma: true, // Allows comma-first coding
				proto: true, // Allows __proto__
				sub: true // Not picky about object['key'] vs. object.key
			},
			node:{
				files:{
					src: ['*.js', '**/*.js', "!node_modules/**/*", "!vendor/**/*", "!src/js/", "!build/public/"]
				},
				options: {
					node: true // Some Node.js specific stuff
				}
			},
			client:{
				files:{
					src: ["src/js/**/*.js"]
				},
				options: { 
					browser: true, // navigator and stuff, plus HTML5 APIs
					devel: true, // console.log and stuff
					jquery: true // Obvious, jQuery stuff such as $
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: '**/*.js',
				tasks: ['jshint']
			},
			css: {
				files: ['**/*.styl'],
				tasks: []
			},
			views: {
				files: ['views/**/*.*'],
				tasks: []
			}
		},
		mochaTest: {
		    test: {
				options: {
				    reporter: 'spec',
				    require: 'test/mocha/node/coverage'
				},
				src: grunt.file.expand('test/mocha/node/**/*.js', 'test/mocha/node/*.js', '!test/mocha/node/coverage.js')
		  	},
		  	coverage: {
				options: {
					reporter: 'html-cov',
			  		quiet: true,
			  		captureFile: 'coverage.html'
				},
				src: grunt.file.expand('test/mocha/node/**/*.js', 'test/mocha/node/*.js', '!test/mocha/node/coverage.js')
		    }
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'uglify', 'stylus']);
	
	// Test task
	grunt.registerTask('test', ['jshint', 'mochaTest']);

};