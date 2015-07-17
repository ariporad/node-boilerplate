/**
 * routes/about.js
 * Created by Ari on 7/1/15.
 */

module.exports = function index(app, express) {
  console.log('initalizing /');
  console.log(app);
  console.log(express);
  app.get('/', (req, res) => {
    res.send('GET request to homepage');
  });
};

module.exports.priority = 10;
