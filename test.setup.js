/*eslint no-var:0, prefer-const:0, no-unused-vars:0*/
/*eslint-env mocha */
/**
 * Created by Ari on 7/4/15.
 */

var sinon = global.sinon = require('sinon');
var chai = global.chai = require('chai');
var expect = global.expect = chai.expect;
var AssertionError = global.AssertionError = chai.AssertionError;

chai.should();

chai.use(require('sinon-chai'));

console.log('Done with common');
require('./test.coverage');
