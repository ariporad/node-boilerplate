var uuid = require("node-uuid"),
	fs   = require("fs");

module.exports.generateSecret = function generateSecret() {
    return uuid.v1() + uuid.v4();
};

module.exports.fail = function fail(reason) {
    throw new Error(reason);
};

module.exports.removeDuplicates = function removeDuplicates(array) {
	return array.filter(function(elem, pos) {
		return array.indexOf(elem) == pos;
	});
};

module.exports.walk = function walk(dir) {
	if (!dir) throw new Error("You Must Pass A Directory to Walk");
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file);
    });
    return results;
};
 
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}