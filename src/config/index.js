/**
 * Created by Ari on 7/16/15.
 */

module.exports =
  require('./env/' + (process.env.NODE_ENV || 'development') + '.json');
