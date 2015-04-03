var express = require("express"),
	http    = require("http"),
	app		= express(),
	server  = http.createServer(express);

require("./config/global")(); // Global Config
require("./config/express")(app, express, server);
require("./routes/loader.js")(app, express, server);


