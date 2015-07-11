/**
 * IMPORTANT: This *must* go before anything and everything else.
 * It emulates a full ES6 environment.
 */
import 'babel/polyfill';

import express from 'express';
import http from 'http';
import path from 'path';

import 'config/global'; // Global Config
import expressConfig from 'config/express';
import loader from 'routes/loader.es6';

const app = express();
const server = http.createServer(express);


// Express config
expressConfig(app, express, server);

// And finally load the routes
loader(app, express, path.resolve(__dirname, '/routes'));


server.listen(8080);

console.log('server started');

module.exports = {
  app,
  server,
  express,
};
