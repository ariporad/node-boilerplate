/**
 * Created by Ari on 7/4/15.
 */

require('./test.coverage');
var chai = global.chai = require('chai');
var expect = global.expect = chai.expect;
var AssertionError = global.AssertionError = chai.AssertionError;

chai.should();

chai.use(require('sinon-chai'));

require('mocha-sinon');