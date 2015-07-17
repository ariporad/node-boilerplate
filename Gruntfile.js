// Make ESLint treat this as ES5
/*eslint no-var:0, prefer-const:0*/

var config = require('./Gruntconfig');
var path = require('path');


module.exports = function Gruntfile(grunt) {
  grunt.config('env',
               grunt.config('env') ||
               process.env.NODE_ENV ||
               'production');

  // configure the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // Build Setup
    //

    // Copy files from src to build
    // It's a very concious design decision to copy everything here,
    // and
    // do all of everything in build/. It clearly sperates the build
    // and
    // the source. You'll notice that even the patterns are only for
    // build as there is no need to every do anything in src/.
    copy: {
      build: {
        cwd: 'src',
        src: ['**'],
        dest: 'build',
        expand: true,
      },
      client: {
        cwd: 'src',
        src: config.client.allFiles,
        dest: 'build',
        expand: true,
      },
      node: {
        cwd: 'src',
        src: config.node.files,
        dest: 'build',
        expand: true,
      },
      stylesheets: {
        cwd: 'src',
        src: config.style.stylus,
        dest: 'build',
        expand: true,
      },
    },

    // Clean the build dir
    clean: {
      build: {
        src: ['build'],
      },
      stylesheets: {
        cwd: 'build',
        src: config.style.all.concat(['public/stylus'], config.clean.ignore),
        expand: true,
      },
      client: {
        cwd: 'build',
        src: config.client.allFiles
          .concat(['vendor', 'public/js'], config.clean.ignore),
        expand: true,
      },
      node: {
        cwd: 'build',
        src: config.node.files.concat(config.clean.ignore),
        expand: true,
      },
      nodeES: {
        cwd: 'build',
        src: config.node.es.files.concat(config.clean.ignore),
        expand: true,
      },
      nodeTests: {
        cwd: 'build',
        src: config.node.tests.concat(config.clean.ignore),
        expand: true,
      },
      clientTests: {
        cwd: 'build',
        src: config.client.tests.concat(config.clean.ignore),
        expand: true,
      },
    },


    //
    // Stylesheets
    //

    // Compile the Styl(us)
    stylus: {
      prod: {
        src: config.style.all.map(function mapStylesToBuildProd(file) {
          return 'build/' + file;
        }),
        dest: config.bundle + 'css',
      },
      dev: {
        options: {
          sourcemap: {
            // grunt-contrib-stylus doesn't support external sourcemaps
            inline: true,
          },
        },
        src: config.style.all.map(function mapStylesToBuildDev(file) {
          return 'build/' + file;
        }),
        dest: config.bundle + 'css',
      },
    },

    // CSS Postproccessing
    postcss: {
      options: {
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer-core')({
            browsers: '> 5%',
          }), // add vendor prefixes
          //        			require('cssgrace'),
          require('postcss-font-family')(),
          require('cssnano')(), // minify the result
        ],
      },
      prod: {
        expand: true,
        src: '**/*.css',
        cwd: 'build',
        dest: 'build',
      },
      dev: {
        expand: true,
        src: '**/*.css',
        cwd: 'build',
        dest: 'build',
        options: {
          map: true,
        },
      },
    },

    //
    // Build the JavaScript
    //

    // Bundle the client side JS
    browserify: {
      options: {
        transform: ['babelify', 'uglifyify'],
      },
      prod: {
        src: 'build/public/js/index.js',
        dest: config.bundle + 'js',
      },
      dev: {
        src: 'build/public/js/index.js',
        dest: config.bundle + 'js',
        options: {
          browserifyOptions: {
            debug: true,
          },
        },
      },
    },

    babel: {
      options: {
        sourceMap: 'inline',
        resolveModuleSource: function resolveModuleSource(source, filename) {
          var finalPath;
          var returnValue;
          console.log('In resolveModuleSource');
          console.log(['Input: File:',
                       filename,
                       'importing module:',
                       source].join(' '));
          if (source.indexOf('./') !== -1) return source;

          finalPath = path.resolve(__dirname, 'build', source);

          if (/.*\..*$/i.test(source)) {
            if (grunt.file.exists(path)) {
              console.log('returning e source');
              returnValue = finalPath;
            } else {
              returnValue = false;
            }
          } else {
            if (grunt.file.exists(path + '.js') ||
                grunt.file.exists(path + '.es') ||
                grunt.file.exists(path + '.es6') ||
                grunt.file.exists(path + '.json')) {
              console.log('returning path');
              returnValue = finalPath;
            } else {
              console.log('returning source');
              returnValue = source;
            }
          }

          console.log(['Output:', returnValue, '\n'].join(' '));
          return returnValue;
        },
      },
      files: {
        expand: true,
        cwd: 'build',
        dest: 'build',
        src: config.node.es.files,
        ext: '.js',
        extDot: 'last',
      },
    },

    //
    // Testing
    //

    eslint: {
      node: {
        src: config.node.es.files.concat(['../Gruntfile.js',
                                          '../Gruntconfig.js',
                                          '../test.*.js']),
        expand: true,
        cwd: 'src',
      },
      client: {
        src: config.client.files,
        expand: true,
        cwd: 'src',
      },
    },

    // Lint the JS files
    // jshint: {
    //	options: {
    //		lastsemic: true, // Allows function(){ return 'Something' }
    //		// <--
    //		// Notice no ';' after return for single-line
    //		// function
    //		laxcomma: true, // Allows comma-first coding
    //		proto: true, // Allows __proto__
    //		esnext: true // ES6
    //	}
    //	,
    //	node: {
    //		src: config.node.files.concat('../Gruntfile.js'),
    //		expand: true,
    //		cwd: 'src',
    //		options: {
    //			node: true // Some Node.js specific stuff
    //		}
    //	}
    //	,
    //	client: {
    //		src: config.client.files,
    //		expand: true,
    //		cwd: 'src',
    //		options: {
    //			browser: true, // navigator and stuff, plus HTML5 APIs
    //			devel: true, // console.log and stuff
    //			jquery: true // Obvious, jQuery stuff such as $
    //		}
    //	}
    // },

    // Test the Nodecode™
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: './test.setup.js',
        },
        expand: true,
        src: config.node.js.tests,
        cwd: 'build',
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html',
        },
        expand: true,
        src: config.node.js.tests,
        cwd: 'build',
      },
      // The travis-cov reporter will fail the tests if the
      // coverage falls below the threshold configured in package.json
      //'travis-cov': {
      //  options: {
      //    reporter: 'travis-cov'
      //  },
      //  expand: true,
      //  src: config.node.js.tests,
      //  cwd: 'src'
      //}
    },

    //
    // Dev
    //

    // Watch the code, start the server
    concurrent: {
      dev: {
        options: {
          logConcurrentOutput: true,
        },
        tasks: ['watch',
                'nodemon:dev',
                'node-inspector:dev'],
      },
    },

    // Automagiaclly restart the server when something changes.
    nodemon: {
      dev: {
        options: {
          file: 'build/main.js',
          nodeArgs: ['--debug'],
          watch: [
            'src/**/*.js',
            'src/**/*.es',
            'src/**/*.es6',
            '!src/public/**/*.*',
            '!src/vendor/**/*.*',
          ],
          env: {},
        },
      },
    },
    // Debug Nodecode™
    'node-inspector': {
      dev: {
        options: {
          'web-port': config.nodeInspector.port,
          'save-live-edit': true,
          'hidden': ['node_modules'],
        },
      },
    },

    // Watch for changes
    watch: {
      livereload: {
        options: {
          livereload: true,
        },
        files: [
          'src/public/**/*.{styl,css,js}',
          'src/views/**/*.*',
        ],
      },
      stylesheets: {
        files: config.style.all,
        options: {
          cwd: 'src',
        },
        tasks: ['stylesheets'],
      },
      client: {
        files: config.client.noTests.concat(config.client.vendor),
        options: {
          cwd: 'src',
        },
        tasks: ['client:dev'],
      },
      clientTests: {
        files: config.client.files,
        tasks: ['clientTests'],
        options: {
          cwd: 'src',
        },
      },
      node: {
        files: config.node.noTests,
        tasks: ['node'],
        options: {
          cwd: 'src',
        },
      },
      nodeTests: {
        files: config.node.files,
        tasks: ['nodeTests'],
        options: {
          cwd: 'src',
        },
      },
    },
  });

  // load the plugins
  require('load-grunt-tasks')(grunt);

  //
  // Tasks
  //

  // Stylesheets
  grunt.registerTask('stylesheets:dev',
                     'Compiles the stylesheets. (w/sourcemaps)',
    ['copy:stylesheets',
     'stylus:dev',
     'postcss:dev',
     'clean:stylesheets',
    ]);
  grunt.registerTask('stylesheets:prod', 'Compiles the stylesheets.',
    ['copy:stylesheets',
     'stylus:prod',
     'postcss:prod',
     'clean:stylesheets',
    ]);

  // Node
  grunt.registerTask('node:dev', 'Compiles the JavaScript files.',
    ['eslint:node',
     'clean:node',
     'copy:node',
     'babel',
     'clean:nodeES',
    ]);
  // Node always compiles with sourcemaps, so all this does is clean tests too.
  grunt.registerTask('node:prod', 'Copiles the JavaScript files.',
    ['node:dev',
     'clean:nodeTests']);
  grunt.registerTask('nodeTests', 'Compiles the JavaScript files.',
    ['node:dev',
     'mochaTest',
     'clean:nodeTests',
    ]);

  // Client
  grunt.registerTask('client:dev',
                     'Compiles the JavaScript files. (w/sourcemaps)',
    ['clean:client',
     'copy:client',
     'eslint:client',
     'browserify:dev',
     'clean:client',
    ]);
  grunt.registerTask('client:prod', 'Compiles the JavaScript files.',
    ['clean:client',
     'copy:client',
     'eslint:client',
     'browserify:prod',
     'clean:client',
     'clean:clientTests',
    ]);
  grunt.registerTask('clientTests', 'Compiles the JavaScript files.',
    ['eslint:client']);

  grunt.registerTask('scripts:dev',
                     'Compiles the JavaScript files (w/sourcemaps).',
    ['node:dev',
     'client:dev',
    ]);
  grunt.registerTask('scripts:prod', 'Compiles the JavaScript files.',
    ['node:prod',
     'client:prod',
    ]);

  grunt.registerTask('test', 'Tests all the code',
    ['nodeTests',
     'clientTests',
    ]);

  grunt.registerTask('build:prod',
                     'Compiles all of the assets and copies the files to ' +
                     'the build directory.',
    ['clean',
     'copy:build',
     'stylesheets:prod',
     'scripts:prod',
    ]);
  grunt.registerTask('build:dev',
                     'Compiles all of the assets and copies the files to ' +
                     'the build directory. (w/sourcemaps)',
    ['clean',
     'copy:build',
     'stylesheets:dev',
     'scripts:dev',
    ]);
  grunt.registerTask('build', 'Runs build:prod', 'build:prod');

  grunt.registerTask('default', 'Runs the dev task',
    ['dev']);
  grunt.registerTask('dev',
                     'Watches the project for changes, automatically builds' +
                     ' them and runs a server.',
    ['build',
     'concurrent:dev',
    ]);
};
