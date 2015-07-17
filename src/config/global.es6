import _ from 'underscore';

global.isDevelopment = process.env.NODE_ENV === 'development';
global.env = process.env.NODE_ENV;
global._ = _;
// We require these so that they aren't hoiseted.
global.config = require('config');
global.utils = require('utils');
