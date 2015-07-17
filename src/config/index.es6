/**
 * Created by Ari on 7/16/15.
 */

const config = require('./env/' +
                       (process.env.NODE_ENV || 'development') +
                       '.json');

module.exports = config;

export default config;
export { config };
