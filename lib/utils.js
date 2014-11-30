var uuid = require("node-uuid")

module.exports.generateSecret = function () {
    return uuid.v1() + uuid.v4();
}