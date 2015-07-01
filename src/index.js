var express = require("express"),
    http    = require("http"),
    app     = express(),
    server  = http.createServer(express);

require("./config/global"); // Global Config

// Express config
require("./config/express")(app, express, server);

// And finaly load the routes
require("./routes/loader.js")(app, express, server);


//server.listen(8080);
//
//console.log('server started');


