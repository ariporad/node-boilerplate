import utils from './utils';


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
    beforeEach(() => {
      this.clean = [1, 2, 3, 4, 5];
      this.dirty = [1, 2, 3, 4, 5, 1, 5, 3, 2, 4];
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
      utils.removeDuplicates(this.dirty).should.eql(this.clean);
    });
    it('Should not modify the original array', () => {
      const original = this.dirty.slice(0);
      utils.removeDuplicates(this.dirty);
      original.should.eql(this.dirty);
    });
  });

  describe('last()', () => {
    beforeEach(() => this.array = [1, '2', false, undefined, 5]);

    it('Should exist', () => {
      utils.should.have.property('last');
    });
    it('Should be a function', () => {
      utils.last.should.be.a('function');
    });
    it('Should not return an array', () => {
      utils.last(this.array).should.not.be.an('array');
    });
    it('Should return the last item of the array', () => {
      utils.last(this.array).should.eql(5);
    });
    it('Should not modify the originaly array', () => {
      const original = this.array.slice(0);
      utils.last(original);
      this.array.should.eql(original);
    });
  });
});
