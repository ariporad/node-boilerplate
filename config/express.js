var mustacheExpress = require("mustache-express");
var utils = require(__dirname + "/lib/utils.js");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var stylus = require("stylus");

module.exports = function (app, express, server) {
	var isDev = process.env.NODE_ENV == 'development';
	
	app.engine('mustache', mustacheExpress());
	
	app.set('view engine', 'mustache');
	app.set('views', __dirname + '/views');
	
	// Middleware
	app.use(session({
		secret: utils.generateSecret()
		// TODO: Setup session store to database (Redis?)
	}))
	app.use(stylus.middleware({
		src: __dirname + "/../src/stylus",
		dest: __dirname + "/../public/css",
		force: isDev,
		linenos: isDev
	}))
	app.use(express.static("public"));
	app.use(express.static("vendor"));
	app.use(cookieParser(utils.generateSecret()));
}