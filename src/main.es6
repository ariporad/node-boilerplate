/**
 * IMPORTANT: These *must* go before anything and everything else.
 * They emulate a full ES6 environment and allow ES6 error traces.
 */
import 'babel/polyfill';
import 'source-map-support/register';

import express from 'express';
import http from 'http';
import path from 'path';
import * as Loader from 'auto-load-dir';

import 'config/global'; // Global Config
import expressConfig from 'config/express';

const app = express();
const server = http.createServer(express);
const promises = [];

let loader;

// Express config
expressConfig(app, express, server);

// And finally load the routes
promises.push(new Promise((resolve, reject) => {
  loader = new Loader.Loader(path.resolve(__dirname, 'routes'),
    [app, express], (err) => {
      return err ? reject(err) : resolve();
    });
}));

Promise.all(promises).then(() => {
  server.listen(8080);
  console.log('server started');

  module.exports = {
    app,
    server,
    express,
    ready: true,
  };
}).catch(console.err);
