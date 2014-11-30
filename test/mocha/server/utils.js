var utils = require("../../../lib/utils")
var assert =  require('assert');

// 36 * 2

describe('utils', function(){
    it('Should have a method called generateSecret()', function(){
        assert.equal(typeof utils.generateSecret, typeof function(){}, "It's not a function!");
    })
    it('generateSecret() should return a string', function() {
        assert.equal(typeof utils.generateSecret(), typeof '');
    })
    it('generateSecret()\'s return value should be 72 characters long', function() {
        assert.equal(utils.generateSecret().length, 72);
    })
})