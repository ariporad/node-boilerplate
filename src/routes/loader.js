var walk  = require('findit'),
    path = require('path'),
    utils = require('lib/utils');

module.exports = exports = function(app, express, server, dir) {
	var modules = [];
	dir = dir || __dirname;

	// Walk this directory recursively, and make a list of all the modules you
	// find
	var walker = walk(dir);
	console.log('Loading routes in directory: ' + dir);
	walker.on('file', function(file, stat) {
		if (file.split('.').last() === 'js' && file !== __filename) {
			var name = file.replace('.js', '');
			name = name.replace(__dirname + '/', 'routes/');
			modules.push(require(name));
			console.log('Loaded route: ' + file);
		}

		// And now we sort them
		modules.sort(function(a, b) {
			return (a.module.priority || 0) - (b.module.priority || 0);
		});

		// For each one
		console.log(modules);
		for (var i = 0; i < modules.length; i++) {
			var module = modules[i];
			module(app, express, server);
		}
	});
};