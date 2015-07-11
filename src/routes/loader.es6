var walk  = require('findit'),
    path = require('path'),
    utils = require('lib/utils');

module.exports = function(app, express, dir) {
	let modules = [];
	dir = dir || __dirname;

	var walker = walk(dir);
	walker.on('file', (file, stat)  => {
		this._processFilename(modules, file);
	});
	walker.on('end', () => {
		this._processModules(modules, app, express);
	});
};

module.exports._sortModules = function (modules) {
	return modules.sort(function(a, b) {
		return (a.module.priority || 0) - (b.module.priority || 0);
	});
};

module.exports._processModules = function (modules, app, express){
	modules = this._sortModules(modules);
	for (let i = 0; i < modules.length; i++) {
		let module = modules[i];
		module(app, express);
	}
};

module.exports._processFilename = function (modules, filename) {
	if (filename.split('.').last() === 'js' && filename !== __filename) {
		var name = filename.replace('.js', '');
		name = name.replace(__dirname, '.');
		console.log(name);
		modules.push(require(name));
	}
};