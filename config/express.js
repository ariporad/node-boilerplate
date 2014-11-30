var mustacheExpress = require("mustache-express");
var utils = require(__dirname + "/lib/utils.js");
var cookieParser = require("cookie-parser");
var session = require("express-session");

module.exports = function (app, express, server) {
	app.engine('mustache', mustacheExpress());
	
	app.set('view engine', 'mustache');
	app.set('views', __dirname + '/views');
	
	// Middleware
	app.use(session({
		secret: utils.generateSecret()
		// TODO: Setup session store to database (Redis?)
	}))
	app.use(express.static("public"));
	app.use(express.static("vendor"));
	app.use(cookieParser(utils.generateSecret()));
}