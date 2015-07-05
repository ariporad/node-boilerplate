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