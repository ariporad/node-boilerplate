/**
 * IMPORTANT: This *must* go before anything and everything else.
 * It allows us to do relative requires. For example `require('lib/utils.js`)
 * will load __dirname/utils.js. Installed modules still work.
 */
require('app-module-path').addPath(__dirname);

var express = require('express'),
    http    = require('http'),
    app     = express(),
    server  = http.createServer(express);

require('config/global'); // Global Config

// Express config
require('config/express')(app, express, server);

// And finally load the routes
require('routes/loader.js')(app, express, __dirname + '/routes');


server.listen(8080);

console.log('server started');


