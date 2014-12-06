module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
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
					files: {
						expand: true,     // Enable dynamic expansion.
						cwd: 'src/stylus/',      // Src matches are relative to this path.
						src: ['*.styl', '**/*.styl'], // Actual pattern(s) to match.
						dest: 'build/public/css/',   // Destination path prefix.
						ext: '.css',   // Dest filepaths will have this extension.
						extDot: 'first'
					}
				}
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
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'uglify', 'stylus']);

};