var walk  = require('findit'),
    path = require('path'),
    utils = require('lib/utils');

module.exports = exports = function(app, express, server, dir) {
	var modules = [];
	dir = dir || __dirname;

	// Walk this directory recrusivly, and make a list of all the modules you
	// find
	var walker = walk(dir);
	console.log('Loading Modules');
	walker.on('file', function(file, stat) {
		if (file.split('.').last() === 'js' && file !== __filename) {
			console.log('Loading Module: ' + file);
			var name = file.replace('.js', '').replace(__dirname + '/', 'routes/');
			console.log({
				route: name,
				module: require(file)
			});
			console.log('Loaded Module: ' + file);
		}

		// And now we sort them
		modules.sort(function(a, b) {
			return (a.module.priority || 0) - (b.module.priority || 0);
		});

		// For each one
		console.log(modules);
		for (var i = 0; i < modules.length; i++) {
			var mod   = modules[i].mod,
			    route = modules[i].route;

			// If it exports and init function, call it first
			if (typeof mod.init === 'function') {
				mod.init(app, express, server);
			}

			// This is a bit complicated. I wanted to allow the modules to
			// export other things as well, So what I did was to default to
			// using `exports[get/put/post/delete]` as routes, and everything
			// else as whatever. But then I deided to add something so that a
			// module could use all of the other ~25 HTTP verbs express
			// supports. So they can optionaly export a exports.verbs array,
			// which contains a list of verbs that they would like to be added
			// as well.
			var verbs = utils.removeDuplicates(['get',
			                                    'put',
			                                    'post',
			                                    'delete'].concat(mod.verbs));
			for (var I = 0; I < verbs.length; I++) {
				var verb = verbs[i];
				if (typeof mod[verb] === 'function') {
					app[verb](route, mod);
				}
			}
		}
	});
};