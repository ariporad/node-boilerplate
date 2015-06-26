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

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}