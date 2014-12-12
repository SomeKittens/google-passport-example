'use strict';

var pg = require('pg'),
    bluebird = require('bluebird'),
    connString = process.env.DATABASE_URL;

bluebird.promisifyAll(pg);
bluebird.promisifyAll(pg.Client.prototype);

module.exports = function (fn) {
  var closeDb;
  return pg.connectAsync(connString).bind({}).spread(function(client, close){
    closeDb = close;
    return fn(client);
  }).finally(closeDb);
};