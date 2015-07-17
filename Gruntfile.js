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
    // It's a very conscious design decision to copy everything here,
    // and do all of everything in build/. It clearly separates the build
    // and the source.
    copy: {
      build: {
        cwd: config.dir.src,
        dest: config.dir.build,
        src: ['**'],
        expand: true,
      },
      client: {
        cwd: config.dir.src,
        dest: config.dir.build,
        src: config.client.allFiles,
        expand: true,
      },
      node: {
        cwd: config.dir.src,
        dest: config.dir.build,
        src: config.node.files,
        expand: true,
      },
      stylesheets: {
        cwd: config.dir.src,
        dest: config.dir.build,
        src: config.style.stylus,
        expand: true,
      },
    },

    // Clean the build dir
    clean: {
      build: {
        src: [config.dir.build],
      },
      stylesheets: {
        cwd: config.dir.build,
        src: config.style.all.concat(['client/stylus'], config.clean.ignore),
        expand: true,
      },
      client: {
        cwd: config.dir.build,
        src: config.client.allFiles
          .concat(['client/vendor', 'client/js'], config.clean.ignore),
        expand: true,
      },
      node: {
        cwd: config.dir.build,
        src: config.node.files.concat(config.clean.ignore),
        expand: true,
      },
      nodeES: {
        cwd: config.dir.build,
        src: config.node.es.files.concat(config.clean.ignore),
        expand: true,
      },
      nodeTests: {
        cwd: config.dir.build,
        src: config.node.tests.concat(config.clean.ignore),
        expand: true,
      },
      clientTests: {
        cwd: config.dir.build,
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
        src: config.toBuild(config.style.all),
        dest: config.bundle + 'css',
      },
      dev: {
        options: {
          sourcemap: {
            // grunt-contrib-stylus doesn't support external sourcemaps
            inline: true,
          },
        },
        src: config.toBuild(config.style.all),
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
          require('postcss-font-family')(),
          require('cssnano')(), // minify the result
        ],
      },
      prod: {
        expand: true,
        src: '**/*.css',
        cwd: config.dir.build,
        dest: config.dir.build,
      },
      dev: {
        expand: true,
        src: '**/*.css',
        cwd: config.dir.build,
        dest: config.dir.build,
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
        src: config.toBuild(config.client.mainFile),
        dest: config.bundle + 'js',
      },
      dev: {
        src: config.toBuild(config.client.mainFile),
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
          if (filename.indexOf('node_modules') > -1) return source;
          console.log('In resolveModuleSource');
          console.log(['Input: File:',
                       filename,
                       'importing module:',
                       source].join(' '));
          if (source.indexOf('./') !== -1) return source;

          finalPath =
            path.resolve(__dirname, config.dir.build, config.dir.node, source);
          console.log(finalPath);

          if (/.*\..*$/i.test(source)) {
            if (grunt.file.exists(path)) {
              console.log('returning e source');
              returnValue = finalPath;
            } else {
              returnValue = false;
            }
          } else {
            if (grunt.file.exists(finalPath + '.js') ||
                grunt.file.exists(finalPath + '.es') ||
                grunt.file.exists(finalPath + '.es6') ||
                grunt.file.exists(finalPath + '.json')) {
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
        cwd: config.dir.build,
        dest: config.dir.build,
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
        cwd: config.dir.src,
      },
      client: {
        src: config.client.files,
        expand: true,
        cwd: config.dir.src,
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
        cwd: config.dir.build,
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html',
        },
        expand: true,
        src: config.node.js.tests,
        cwd: config.dir.build,
      },
      // The travis-cov reporter will fail the tests if the
      // coverage falls below the threshold configured in package.json
      //'travis-cov': {
      //  options: {
      //    reporter: 'travis-cov'
      //  },
      //  expand: true,
      //  src: config.node.js.tests,
      //  cwd: config.dir.build,
      //}
    },

    // Generate the Docs
    jsdoc: {
      node: {
        src: config.toSrc(config.node.files),
        options: {
          destination: config.node.docs,
        },
      },
      client: {
        src: config.toSrc(config.client.files),
        options: {
          destination: config.client.docs,
        },
      },
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
          file: '<%=pkg.main%>',
          nodeArgs: ['--debug'],
          watch: config.toSrc('**/*.js',
                              '**/*.es',
                              '**/*.es6',
                              config.node.ignore),
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
          config.client.dir + '/**/*.{styl,css,js}',
        ],
      },
      stylesheets: {
        files: config.style.all,
        options: {
          cwd: config.dir.src,
        },
        tasks: ['stylesheets'],
      },
      client: {
        files: config.client.noTests.concat(config.client.vendor),
        options: {
          cwd: config.dir.src,
        },
        tasks: ['client:dev'],
      },
      clientTests: {
        files: config.client.files,
        tasks: ['clientTests'],
        options: {
          cwd: config.dir.src,
        },
      },
      node: {
        files: config.node.noTests,
        tasks: ['node'],
        options: {
          cwd: config.dir.src,
        },
      },
      nodeTests: {
        files: config.node.files,
        tasks: ['nodeTests'],
        options: {
          cwd: config.dir.src,
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
    ['clean:build',
     'copy:build',
     'stylesheets:prod',
     'scripts:prod',
    ]);
  grunt.registerTask('build:dev',
                     'Compiles all of the assets and copies the files to ' +
                     'the build directory. (w/sourcemaps)',
    ['clean:build',
     'copy:build',
     'stylesheets:dev',
     'scripts:dev',
     'jsdoc',
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
