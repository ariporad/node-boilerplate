/* jshint ignore:start */
/* global describe, it, beforeEach, before, afterEach, after */
/* jshint ignore:end */

/**
 * These are the tests for /config/express.es6
 * They run in development, unless you explicitly make them run in production
 *
 * To run in production, call `production()` before calling `run()`
 * To run in development, call `development()` before calling `run()`
 *
 * To Override a global variable in the module, pass an object to run, where
 * every key in that object is the name of a global variable, The value should
 * be what you want to replace it with.
 *
 * Everything resets for each test, new duds, reloads the module, everything.
 */

import rewire from 'rewire';
import path from 'path';
import fs from 'fs';

// Todo: Sinon!

let expressConfig;
let app;
let server;
let express;

/**
 * @desc Constructor for an express dud.
 */
function makeExpressDud() {
  const e = {};

  e.staticFiles = (directory) => {
    this.__data__.staticDirs.push(directory);
    return this.__returns__.staticFiles + directory;
  };

  e.__data__ = { // The passed in data for access later
    staticDirs: [],
  };

  e.__returns__ = { // The values returned by the duds
    staticFiles: 'static:',
  };

  return e;
}

/**
 * @desc Constructor for an App Dud.
 */
function makeAppDud() {
  const a = {};

  a.set = (key, value) => {
    this.__data__.data[key] = value;
    return this.__returns__.set;
  };

  a.get = (key) => {
    return this.__data__.data[key];
  };

  a.use = (middleware) => {
    this.__data__.middlewares.push(middleware);
    return this.__returns__.use;
  };

  a.engine = (name, engine) => {
    this.__data__.engines[name] = engine;
    return this.__returns__.engine;
  };

  a.__data__ = { // The passed in data for access later
    data: {},
    middlewares: [],
    engines: {},
  };

  a.__returns__ = { // The values returned by the duds
    set: 'SetAValue',
    use: 'UseUsetoUseThings',
    engine: 'V2, V4, V6, V8, V10, V12 or AC Induction?',
  };

  return a;
}

/**
 * @desc Constructor function for a server dud
 */
function makeServerDud() {
  const s = {};

  // The server is not yet used, so this does nothing.

  s.__data__ = { // The passed in data for access later

  };

  s.__returns__ = { // The Dud values that the methods return.

  };

  return s;
}

/**
 * @desc Runs expressConfig(app, server, express)
 * @arg Object, Each key should be the name of a global variable, each value
 * what you want to stud it with. It will be replaced in in the module.
 */
function run(overrides) {
  if (overrides) {
    expressConfig.__set__(overrides);
  }
  expressConfig(app, express, server);
}

/**
 * @desc Sets NODE_ENV for the tested module to env
 */
function setEnv(env) {
  const p = process;

  p.env.NODE_ENV = env;

  expressConfig.__set__({
    process: p,
  });
}

describe('config/express', () => {
  /**
   * @desc resets everything, new duds, it reloads the module, clears any data.
   */
  beforeEach(() => {
    expressConfig = rewire('./express');
    app = makeAppDud();
    server = makeServerDud();
    express = makeExpressDud();
    setEnv('development');
  });

  it('should export a function', () => {
    expressConfig.should.be.a('function');
  });

  it('should setup ejs', () => {
    function ejs() {
      return 'ejs';
    }

    run({
      ejs,
    });

    app.__data__.data['view engine'].should.be.exist();
    app.__data__.data['view engine'].should.be.equal('ejs');

    app.__data__.engines.ejs.should.be.exist();
    app.__data__.engines.ejs.should.be.equal(ejs);
  });

  it('should set the views directory', () => {
    run();
    app.__data__.data.views.should.exist();
    fs
      .existsSync(app.__data__.data.views)
      .should
      .be
      .true('Views Directory Should Exist');
  });

  describe('app.locals', () => {
    it('should exist', () => {
      run();
      app.locals.should.exist();
    });
    it('should have .pkg', () => {
      run();
      app.locals.pkg.should.exist();
    });
  });

  describe('Middleware', () => {
    describe('Session', () => {
      it('should app.use(express-session(args))', () => {
        function sessionMiddleware(args) {
          return 'session';
        }

        run({
          'session': sessionMiddleware,
        });

        app.__data__.middlewares.should.contain(sessionMiddleware());
      });

      it('should generate a unique secret every time', () => {
        let sessionArgs = {};

        function sessionMiddleware(args) {
          sessionArgs = args;

          return 'session';
        }

        run({
          'session': sessionMiddleware,
        });

        const oldSecret = sessionArgs.secret;

        run({
          'session': sessionMiddleware,
        });

        oldSecret.should.not.equal(sessionArgs.secret);
      });
    });
    describe('Cookie Parser', () => {
      it('should app.use(express-cookieparser(uniqueSecret))', () => {
        function cookieParser(secret) {
          return 'cookiejar';
        }

        run({
          cookieParser,
        });

        app.__data__.middlewares.should.contain(cookieParser());
      });

      it('Should always make uniqueSecret unique', () => {
        let secret;

        function cookieParser(s) {
          secret = s;
        }

        run({
          cookieParser,
        });

        const oldSecret = secret;

        run({
          cookieParser,
        });

        oldSecret.should.not.equal(secret);
      });
    });
    describe('Static Files', () => {
      describe('express.static', () => {
        it('Should be called for /vendor/', () => {
          run();
          app.__data__.middlewares.should.contain(
            express.__returns__.static +
            path.resolve(__dirname, '../vendor'));
        });

        it('Should be called for /public/', () => {
          run();
          app.__data__.middlewares.should.contain(
            express.__returns__.static +
            path.resolve(__dirname, '../public'));
        });
      });
    });
  });
});

