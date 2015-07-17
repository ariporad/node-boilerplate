/**
 * IMPORTANT: These *must* go before anything and everything else.
 * They emulate a full ES6 environment and allow ES6 error traces.
 */
import 'babel/polyfill';
import 'source-map-support/register';

import express from 'express';
import path from 'path';
import loader from 'auto-load-dir';

import 'config/global'; // Global Config
import expressConfig from 'config/express';

/**
 * @name start
 * @desc Starts the server on port {port}
 * @param {Number} port - The port to start the server on.
 * @returns {undefined} Nothing
 * @type {Function}
 */
const start = module.exports = function start(port) {
  const app = express();
  // const server = http.createServer(express);
  const promises = [];


  // Express config
  expressConfig(app, express);

  // And finally load the routes
  promises.push(new Promise((resolve, reject) => {
    loader(path.resolve(__dirname, 'routes'), [app, express],
           (err) => err ? reject(err) : resolve());
  }));


  Promise.all(promises).then(() => {
    app.listen(port);
    console.log(`Server started on port ${port}.`);
  }).catch(console.error);
};

if (require.main === module) {
  start(process.env.PORT || 8080);
}
