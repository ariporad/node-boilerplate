var config = require('./Gruntconfig');


module.exports = function(grunt) {
  grunt.config('env',
               grunt.config('env') ||
               process.env.NODE_ENV ||
               'production');

  grunt.config('sourcemaps', grunt.config('env') === 'development');

  console.log(grunt.config('sourcemaps') ?
              'Using sourcemaps' :
              'No sourcemaps');

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
        expand: true
      },
      client: {
        cwd: 'src',
        src: config.client.allFiles,
        dest: 'build',
        expand: true
      },
      node: {
        cwd: 'src',
        src: config.node.files,
        dest: 'build',
        expand: true
      },
      stylesheets: {
        cwd: 'src',
        src: config.style.stylus,
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
        src: config.style.all.concat(config.clean.ignore),
        expand: true
      },
      client: {
        cwd: 'build',
        src: config.client.allFiles
          .concat(config.clean.ignore, ['vendor']),
        expand: true
      },
      node: {
        cwd: 'build',
        src: config.node.files.concat(config.clean.ignore),
        expand: true
      },
      nodeES: {
        cwd: 'build',
        src: config.node.es.files.concat(config.clean.ignore),
        expand: true
      },
      nodeTests: {
        cwd: 'build',
        src: config.node.tests.concat(config.clean.ignore),
        expand: true
      },
      nodeTestsES: {
        cwd: 'build',
        src: config.node.es.tests.concat(config.clean.ignore),
        expand: true
      },
      clientTests: {
        cwd: 'build',
        src: config.client.tests.concat(config.clean.ignore),
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
        src: config.style.all.map(function(file) {
          return 'build/' + file;
        }),
        dest: config.bundle + 'css'
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
        dest: config.bundle + 'js',
        options: {
          browserifyOptions: {
            debug: grunt.config('sourcemaps')
          },
          transform: ['babelify', 'uglifyify']
        }
      }
    },

    babel: {
      options: {
        sourceMap: grunt.config('sourcemaps') && 'inline',
        resolveModuleSource: function(src, file) {
          var o = (function(source, filename) {
            if (source.indexOf('./') !== -1) return source;

            var path = __dirname + '/build/' + source;

            if (/.*\..*$/i.test(source)) {
              if (grunt.file.exists(path)) {
                console.log('returning e source');
                return __dirname + '/build/' + source;
              } else {
                return false;
              }
            } else {
              if (grunt.file.exists(path + '.js') ||
                  grunt.file.exists(path + '.es') ||
                  grunt.file.exists(path + '.es6') ||
                  grunt.file.exists(path + '.json')) {
                console.log('returning path');
                return path;
              } else {
                console.log('returning source');
                return source;
              }
            }
          })(src, file);

          console.log('Input: File ' +
                      file +
                      ' importing module ' +
                      src);
          console.log('Output: ' + o);
          return o;
        }
      },
      files: {
        expand: true,
        cwd: 'build',
        dest: 'build',
        src: config.node.es.files,
        ext: '.js',
        extDot: 'last'
      }
    },

    //
    // Testing
    //

    eslint: {
      node: {
        src: config.node.es.files,
        expand: true,
        cwd: 'src'
      },
      client: {
        src: config.client.files,
        expand: true,
        cwd: 'src'
      }
    },

    // Lint the JS files
    //jshint: {
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
    //},

    // Test the Nodecode™
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: './test.setup.js'
        },
        expand: true,
        src: config.node.js.tests,
        cwd: 'build'
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        expand: true,
        src: config.node.js.tests,
        cwd: 'build'
      },
      // The travis-cov reporter will fail the tests if the
      // coverage falls below the threshold configured in package.json
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        expand: true,
        src: config.node.js.tests,
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
                'open:dev'
        ]
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
          'web-port': config.nodeInspector.port,
          'save-live-edit': true,
          'hidden': ['node_modules']
        }
      }
    },

    // Auto open the browser
    open: {
      options: {
        delay: 10 // Rough count/guess as to the startup time
        // needed.
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
          src: config.style.all
        },
        options: {
          tasks: ['stylesheets']
        }
      },
      client: {
        files: {
          expand: true,
          cwd: 'src',
          src: config.client.noTests.concat(config.client.vendor)
        },
        options: {
          tasks: ['client']
        }
      },
      clientTests: {
        files: {
          expand: true,
          cwd: 'src',
          src: config.client.files
        },
        options: {
          tasks: ['clientTests']
        }
      },
      node: {
        files: {
          expand: true,
          cwd: 'src',
          src: config.node.noTests
        },
        options: {
          tasks: ['node']
        }
      },
      nodeTests: {
        files: {
          expand: true,
          cwd: 'src',
          src: config.node.tests
        },
        options: {
          tasks: ['nodeTests']
        }
      },
      copy: {
        files: {
          src: ['**'].concat(config.negate(
            config.client.allFiles,
            config.node.files,
            config.style.all)),
          expand: true,
          cwd: 'src'
        },
        options: {
          tasks: ['copy']
        }
      }
    }
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
                     'Compiles the stylesheets.', ['copy:stylesheets',
                                                   'stylus',
                                                   'postcss',
                                                   'clean:stylesheets'
    ]);

  // Node
  grunt.registerTask('node',
                     'Compiles the JavaScript files.', ['eslint:node',
                                                        'clean:node',
                                                        'copy:node',
                                                        'babel',
                                                        'clean:nodeES'
    ]);
  grunt.registerTask('nodeTest',
                     'Compiles the JavaScript files.', ['node',
                                                        'mochaTest'
    ]);

  // Client
  grunt.registerTask('client',
                     'Compiles the JavaScript files.', ['clean:client',
                                                        'copy:client',
                                                        'eslint:client',
                                                        'browserify',
                                                        'clean:client'
    ]);
  grunt.registerTask('clientTest',
                     'Compiles the JavaScript files.', ['eslint:client']);

  grunt.registerTask('scripts',
                     'Compiles the JavaScript files.', ['node',
                                                        'client'
    ]);

  grunt.registerTask('test',
                     'Tests all the code', ['nodeTest',
                                            'clientTest'
    ]);

  grunt.registerTask('build',
                     'Compiles all of the assets and copies the files to ' +
                     'the build directory.', ['clean:build',
                                              'copy:build',
                                              'stylesheets',
                                              'scripts'
    ]);

  grunt.registerTask('default', 'Runs the dev task', ['dev']);
  grunt.registerTask('dev',
                     'Watches the project for changes, automatically builds' +
                     ' them and runs a server.', ['env:development',
                                                  'build',
                                                  'concurrent:dev'
    ]);
};
