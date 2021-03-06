/*global chai,sinon,expect,AssertionError*/
/*eslint no-var:0, prefer-const:0*/
/*eslint-env mocha */

import * as utils from './utils';


describe('utils', () => {
  describe('generateSecret()', () => {
    it('Should exist', () => {
      utils.should.have.property('generateSecret');
    });
    it('Should be a function', () => {
      utils.generateSecret.should.be.a('function');
    });
    it('Should return a string', () => {
      utils.generateSecret().should.be.a('string');
    });
    it('It\'s return value should be 72 characters long', () => {
      utils.generateSecret().should.have.length(72);
    });
  });

  describe('fail()', () => {
    it('Should exist', () => {
      utils.should.have.property('fail');
    });
    it('Should be a function', () => {
      utils.fail.should.be.a('function');
    });
    it('It should throw an error', () => {
      utils.fail.should.throw(Error);
    });
    it('It should throw an error with whatever you pass it.', () => {
      (() => {
        utils.fail('Testing 1, 2, 3');
      }).should.throw(Error, 'Testing 1, 2, 3');
    });
  });

  describe('removeDuplicates()', () => {
    let clean;
    let dirty;
    beforeEach(() => {
      clean = [1, 2, 3, 4, 5];
      dirty = [1, 2, 3, 4, 5, 1, 5, 3, 2, 4];
    });

    it('Should exist', () => {
      utils.should.have.property('removeDuplicates');
    });
    it('Should be a function', () => {
      utils.removeDuplicates.should.be.a('function');
    });
    it('Should return an array', () => {
      utils.removeDuplicates([1, 2, 2, 3]).should.be.an('array');
    });
    it('Should remove the duplicates from an array', () => {
      utils.removeDuplicates(dirty).should.eql(clean);
    });
    it('Should not modify the original array', () => {
      const original = dirty.slice(0);
      utils.removeDuplicates(dirty);
      original.should.eql(dirty);
    });
  });

  describe('last()', () => {
    let array;
    beforeEach(() => {
      array = [1, '2', false, undefined, 5];
    });

    it('Should exist', () => {
      utils.should.have.property('last');
    });
    it('Should be a function', () => {
      utils.last.should.be.a('function');
    });
    it('Should not return an array', () => {
      utils.last(array).should.not.be.an('array');
    });
    it('Should return the last item of the array', () => {
      utils.last(array).should.eql(5);
    });
    it('Should not modify the originaly array', () => {
      const original = array.slice(0);
      utils.last(original);
      array.should.eql(original);
    });
  });
});
