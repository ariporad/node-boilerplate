var utils = require("../../../lib/utils");
var should =  require('chai').should();

// 36 * 2

describe('utils', function(){
	describe('generateSecret()', function () {
		it('Should exist', function() {
		    utils.should.have.property('generateSecret');
		});
		it('Should be a function.', function(){
			utils.generateSecret.should.be.a('function');
		});
		it('Should return a string', function() {
			utils.generateSecret().should.be.a('string');
		});
		it('It\'s return value should be 72 characters long', function() {
			utils.generateSecret().should.have.length(72);
		});
	});

	describe('fail()', function () {
		it('Should exist', function() {
		    utils.should.have.property('fail');
		});
		it('Should be a function.', function(){
			utils.fail.should.be.a('function');
		});
		it('It should throw an error', function() {
			utils.fail.should.throw(Error);
		});
		it('It should throw an error with whatever you pass it.', function() {
			(function() { utils.fail("Testing 1, 2, 3") }).should.throw(Error, "Testing 1, 2, 3");
		});
	});
});