var uuid = require("node-uuid")

module.exports.generateSecret = function () {
    return uuid.v1() + uuid.v4();
}

module.exports.fail = function(reason) {
    throw new Error(reason)
}