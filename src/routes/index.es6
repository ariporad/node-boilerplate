/**
 * routes/about.js
 * Created by Ari on 7/1/15.
 */

module.exports = function index(app, express) {
  app.get('/', (req, res) => {
    res.send('Hello World! 1');
    res.end();
  });
};

module.exports.priority = 10;
