var rewire = require("rewire"),
	utils = rewire("./utils"),
	fs = require("fs"),
	chai = require('chai'),
	expect = chai.expect;

chai.should();

describe('utils', function () {

	describe('generateSecret()', function () {
		it('Should exist', function () {
			utils.should.have.property('generateSecret');
		});
		it('Should be a function', function () {
			utils.generateSecret.should.be.a('function');
		});
		it('Should return a string', function () {
			utils.generateSecret().should.be.a('string');
		});
		it('It\'s return value should be 72 characters long', function () {
			utils.generateSecret().should.have.length(72);
		});
	});

	describe('fail()', function () {
		it('Should exist', function () {
			utils.should.have.property('fail');
		});
		it('Should be a function', function () {
			utils.fail.should.be.a('function');
		});
		it('It should throw an error', function () {
			utils.fail.should.throw(Error);
		});
		it('It should throw an error with whatever you pass it.', function () {
			(function () {
				utils.fail("Testing 1, 2, 3");
			}).should.throw(Error, "Testing 1, 2, 3");
		});
	});

	describe('removeDuplicates()', function () {
		var Array = [1, 2, 3, 4, 5],
			ArrayWithDuplicates = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

		it('Should exist', function () {
			utils.should.have.property('removeDuplicates');
		});
		it('Should be a function', function () {
			utils.removeDuplicates.should.be.a('function');
		});
		it('Should return an array', function () {
			utils.removeDuplicates([1, 2, 2, 3]).should.be.an('array');
		});
		it('Should remove the duplicates from an array', function () {
			utils.removeDuplicates(ArrayWithDuplicates).should.eql(Array);
		});
		it('Should not modify the originaly array', function () {
			var original = ArrayWithDuplicates.slice(0);
			utils.removeDuplicates(ArrayWithDuplicates);
			ArrayWithDuplicates.should.eql(original);
		});
	});
});