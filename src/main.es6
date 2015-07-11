/**
 * IMPORTANT: This *must* go before anything and everything else.
 * It emulates a full ES6 environment.
 */
import 'babel/polyfill';

import * as express from 'express';
import * as http from 'http';

// Note, in this file, it is not possible to require like in other files, as
// Babel puts these above the line which allows relative requires.
import 'config/global'; // Global Config
import * as expressConfig from 'config/express';
import * as loader from 'routes/loader.js';

let app = express(),
    server = http.createServer(express);


// Express config
expressConfig(app, express, server);

// And finally load the routes
loader(app, express, __dirname + '/routes');


server.listen(8080);

console.log('server started');


