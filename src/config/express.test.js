/* jshint ignore:start */
/* global describe, it, beforeEach, before, afterEach, after */
/* jshint ignore:end */

/**
 * These are the tests for /config/express.js
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

var rewire = require('rewire');
var path = require('path');
var fs = require('fs');

var expressConfig, app, server, express;

/**
 * @desc Constructor for an express dud.
 */
function makeExpressDud() {
	var e = {};

	e.static = function (directory) {
		this.__data__.staticDirs.push(directory);
		return this.__returns__.static + directory;
	};

	e.__data__ = { // The passed in data for access later
		staticDirs: []
	};

	e.__returns__ = { // The values returned by the duds
		static: 'static:'
	};

	return e;
}

/**
 * @desc Constructor for an App Dud.
 */
function makeAppDud() {
	var a = {};

	a.set = function (key, value) {
		this.__data__.data[key] = value;
		return this.__returns__.set;
	};

	a.get = function (key) {
		return this.__data__.data[key];
	};

	a.use = function (middleware) {
		this.__data__.middlewares.push(middleware);
		return this.__returns__.use;
	};

	a.engine = function (name, engine) {
		this.__data__.engines[name] = engine;
		return this.__returns__.engine;
	};

	a.__data__ = { // The passed in data for access later
		data: {},
		middlewares: [],
		engines: {}
	};

	a.__returns__ = { // The values returned by the duds
		set: 'SetAValue',
		use: 'UseUsetoUseThings',
		engine: 'V2, V4, V6, V8, V10, V12 or AC Induction?'
	};

	return a;
}

/**
 * @desc Constructor function for a server dud
 */
function makeServerDud() {
	var s = {};

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
 * @desc Sets NODE_ENV for the tested module to development
 */
function development() {
	var p = process;

	p.env.NODE_ENV = 'development';

	expressConfig.__set__({
		process: p
	});
}

/**
 * @desc Sets NODE_ENV for the tested module to production
 */
function production() {
	var p = process;

	p.env.NODE_ENV = 'production()';

	expressConfig.__set__({
		process: p
	});
}

describe('config/express.js', function () {

/**
 * @desc resets everything, new duds, it reloadsthe module, clears any data.
 */
beforeEach(function () {
	expressConfig = rewire('./express');
	app = makeAppDud();
	server = makeServerDud();
	express = makeExpressDud();
	development();
});

it('should export a function', function () {
	expressConfig.should.be.a('function');
});

it('should setup ejs', function () {
	function ejs() {
		return 'ejs';
	}

	run({
		ejs: ejs
	});

	app.__data__.data['view engine'].should.be.exist();
	app.__data__.data['view engine'].should.be.equal('ejs');

	app.__data__.engines.ejs.should.be.exist();
	app.__data__.engines.ejs.should.be.equal(ejs);
});

it('should set the views directory', function () {
	run();
	app.__data__.data.views.should.exist();
	fs
		.existsSync(app.__data__.data.views)
		.should
		.be
		.true('Views Directory Should Exist');
});

describe('app.locals', function () {
	it('should exist', function() {
		run();
		app.locals.should.exist();
	});
	it('should have .pkginfo', function() {
		run();
		app.locals.pkginfo.should.exist();
	});
});

describe('Middleware', function () {
	describe('Session', function () {
		it('should app.use(express-session(args))', function () {

			var sessionArgs;

			function sessionMiddleware(args) {
				sessionArgs = args;

				return 'session';
			}

			run({
				'session': sessionMiddleware
			});

			app.__data__.middlewares.should.contain(sessionMiddleware());
		});

		it('should generate a unique secret every time', function () {

			var sessionArgs = {};

			function sessionMiddleware(args) {
				sessionArgs = args;

				return 'session';
			}

			run({
				'session': sessionMiddleware
			});

			var oldSecret = sessionArgs.secret;

			run({
				'session': sessionMiddleware
			});

			oldSecret.should.not.equal(sessionArgs.secret);
		});
	});
	describe('Cookie Parser', function () {
		it('should app.use(express-cookieparser(uniqueSecret))', function () {

			function cookieParser(secret) {
				return 'cookiejar';
			}

			run({
				'cookieParser': cookieParser
			});

			app.__data__.middlewares.should.contain(cookieParser());
		});

		it('Should always make uniqueSecret unique', function () {

			var secret = '';

			function cookieParser(s) {
				secret = s;
			}

			run({
				'cookieParser': cookieParser
			});

			var oldSecret = secret;

			run({
				'cookieParser': cookieParser
			});

			oldSecret.should.not.equal(secret);
		});
	});
	describe('Static Files', function () {
		describe('express.static', function () {
			it('Should be called for /vendor/', function () {
				run();
				app.__data__.middlewares.should.contain(
					express.__returns__.static +
					path.resolve(__dirname, '../vendor'));
			});

			it('Should be called for /public/', function () {
				run();
				app.__data__.middlewares.should.contain(
					express.__returns__.static +
					path.resolve(__dirname, '../public'));

			});
		});
	});
});
});