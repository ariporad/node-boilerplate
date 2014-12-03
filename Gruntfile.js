module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
			},
			build: {
				src: 'src/**/*.js',
				dest: 'build/public/**/*.js'
			}
		},
		stylus: {
			compile: {
				options:{
					files: {
						'public/css/**/*.css': 'src/stylus/**/*.styl'
					}
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['uglify', 'stylus', 'jshint']);
	grunt.registerTask('test', function(){})

};