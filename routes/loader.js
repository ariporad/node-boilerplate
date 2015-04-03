module.exports = exports = function (app, express, server, dir) {
	var modules = {};
	dir = dir || __dirname
	
	// Walk this directory recrusivly, and make a list of all the module you find
	utils.walk(dir + "/").forEach(function(file) {
		if (file.split(".").last === "js" && file !== 'loader.js') {
			var name = file.replace('.js', '');
			modules[name] = require('./' + file);
		}
	});
	
	// And now we sort them
	modules.sort(function (a, b) {
		return ( a.priority || 0 ) - ( b.priority || 0 );
	});
	
	// For each one
	for (var i = 0; i < modules.length; i++) {
		var route = modules[i];
		
		// If it exports and init function, call it first
		if (typeof modules[route].init === 'function') {
			modules[route].init(app, express, server);
		}
		
		// This is a bit complicated. I wanted to allow the modules to export other things as well,
		// So what I did was to default to using exports[get/put/post/delete] as routes, and everything else as whatever.
		// But then I deided to add something so that a module could use all of the other ~25 HTTP verbs express supports,
		// So they can optionaly export a exports[verbs] array, which contains a list of verbs that they would like to be used as well
		var verbs = utils.removeDuplicates(["get", "put", "post", "delete"].concat(modules[route].verbs));
		for (var I = 0; I < verbs.length; I++) {
			var verb = verbs[i];
			if (typeof route[verb] === 'function') {
				app[verb](route, modules[route]);
			}
		}
	}
};