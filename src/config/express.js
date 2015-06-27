var ejs = require('ejs-mate');
var utils = require(__dirname + '/../lib/utils.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var pkginfo = require('pkginfo')(module);

module.exports = function (app, express, server) {
	app.engine('ejs', ejs);

	app.set('view engine', 'ejs');
	app.set('views', path.resolve(__dirname, '../views'));

	app.locals = {
		pkginfo: pkginfo
	};

	// Middleware

	app.use(session({
		secret: utils.generateSecret(),
		saveUninitialized: true,
		resave: false
			// TODO: Setup session store to database (Redis?)
	}));

	app.use(express.static(path.resolve(__dirname, '../public')));
	app.use(express.static(path.resolve(__dirname, '../vendor')));
	app.use(cookieParser(utils.generateSecret()));
};