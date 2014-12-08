var mustacheExpress = require("mustache-express");
var utils = require(__dirname + "/../lib/utils.js");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var stylus = require("stylus");
var path = require("path");

module.exports = function (app, express, server) {
	app.engine('mustache', mustacheExpress());
	
	app.set('view engine', 'mustache');
	app.set('views', path.resolve(__dirname, '../views'));
	
	// Middleware
	
	app.use(session({
		secret: utils.generateSecret(),
		saveUninitialized: true,
		resave: false
		// TODO: Setup session store to database (Redis?)
	}));
	if(process.env.NODE_ENV == 'development') {
		app.use(stylus.middleware({
			src: __dirname + "/../src/stylus",
			dest: __dirname + "/../build/public/css",
			force: true,
			linenos: true
		}));
	} else {
		app.use(express.static("build/public"));
	}
	app.use(express.static("static"));
	app.use(express.static("vendor"));
	app.use(cookieParser(utils.generateSecret()));
};