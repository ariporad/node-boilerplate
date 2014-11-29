var mustacheExpress = require("mustache-express")

module.exports = function (app, express, server) {
    app.engine('mustache', mustacheExpress());
    
    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/views');
}