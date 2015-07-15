import utils from '../lib/utils';
import _ from 'underscore';

global.utils = utils;
global.isDevelopment = process.env.NODE_ENV === 'development';
global._ = _;
