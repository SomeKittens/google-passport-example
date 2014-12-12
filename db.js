'use strict';

var pg = require('pg')
  , bluebird = require('bluebird')
  , connString = process.env.DATABASE_URL;

bluebird.promisifyAll(pg);
bluebird.promisifyAll(pg.Client.prototype);

module.exports = function () {
  var closeDb;
  return pg.connectAsync(connString).bind({}).spread(function(client, close){
    closeDb = close;
    this.client = client;
  }).finally(closeDb);
};