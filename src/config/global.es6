import * as utils from 'lib/utils';

global.utils = utils;
global.isDevelopment = process.env.NODE_ENV === 'development';