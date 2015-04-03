module.exports = exports = function (app, express, server) {
	var modules = {};
	utils.walk(__dirname + "/").forEach(function(file) {
		if (file.split(".").last === "js" && file !== 'loader.js') {
			var name = file.replace('.js', '');
			modules[name] = require('./' + file);
		};
	});
	for (route in modules) {
		(typeof modules[route].init === 'function') ? modules[route].init(app, express, server) : null;
		var verbs = utils.removeDuplicates(["get", "put", "post", "delete"].concat(modules[route].verbs));
		for (verb in verbs) {
			if (typeof route[verb] === 'function') {
				app[verb](route, modules[route]);
			}
		}
	}
};