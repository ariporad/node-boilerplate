module.exports = exports = function (app, express, server) {
	var modules = {};
	utils.walk(__dirname + "/").forEach(function(file) {
		if (file.split(".").last === "js" && file !== 'loader.js') {
			var name = file.replace('.js', '');
			modules[name] = require('./' + file);
		}
	});
	
	for (var i = 0; i < modules.length; i++) {
		var route = modules[i];
		if (typeof modules[route].init === 'function') {
			modules[route].init(app, express, server);
		}
		
		var verbs = utils.removeDuplicates(["get", "put", "post", "delete"].concat(modules[route].verbs));
		for (var I = 0; I < verbs.length; I++) {
			var verb = verbs[i];
			if (typeof route[verb] === 'function') {
				app[verb](route, modules[route]);
			}
		}
	}
};