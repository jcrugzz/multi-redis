/*
 * index.js :: main module include for MultiRedis
 *
 * (C) 2013, Jarrett Cruger, MIT
 *
 */

var events = require('events'),
    util = require('util'),
    Hashring = require('hashring'),
    redis = require('redis'),
    noop = function () {};

//
// ### function MultiRedis(redises)
// #### @redises {Array} An array of redis objects with `host`, `port` and optional password
// Constructor function that instantiates all of the redis clients based on the
// connection info
//
var MultiRedis = function (redises) {
  events.EventEmitter.call(this);

  //
  // Set the redis to a default local redis for testing purposes
  //
  redises = redises || [{ host: '127.0.0.1', port: 6379 }];

  //
  // Throw an error if an array is not passed in
  //
  if(!Array.isArray(redises)) {
    throw new Error('You must give an array of objects with redis details');
  }

  //
  // If every obj does not have correct `host` and `port`, throw an error
  //
  var sound = redises.every(function (obj) {
    if (!obj.host && !obj.port) { return false }
    return true;
  });

  if(!sound) {
    throw new Error('Objects must contain a host and port property with an optional password');
  }
  //
  // Make the array of redis options objects into strings
  // to be used in the hashring
  //
  this.strings = redises.map(function (obj) {
    return obj.password
      ? [obj.host, obj.port, obj.password].join(':')
      : [obj.host, obj.port].join(':');
  });

  //
  // Create the hashring
  //
  this.hash = new Hashring(this.strings);

  //
  // Create all the redis client sto attach to this instance.
  //
  this.clients = this.strings.reduce(function (clients, key) {
    var pieces = key.split(':');
    clients[key] = redis.createClient(pieces[1], pieces[0]);
    clients[key].on('error', this.emit.bind(this, 'error'));
    if(pieces.length === 3) {
      clients[key].auth(pieces[2], noop);
    }
    return clients;
  }.bind(this), {});

}

util.inherits(MultiRedis, events.EventEmitter);

//
// ### function client (key)
// ### @key {String} Key to use in the hashring
// Returns you the appropriate redis client based on the hashring that this
// particular key would be stored in
//
MultiRedis.prototype.client = function (key) {
  return this.clients[this.hash.get(key)];
};

//
// ### function end ()
// Kill all the redis clients that are open cleanly
//
MultiRedis.prototype.end = function () {
  Object.keys(this.clients).forEach(function (key) {
    this.clients[key].end();
  }.bind(this));
};

//
// Export function
//
module.exports = function (redises) {
  return new MultiRedis(redises);
};

//
// Throw the prototype on here because why not
//
module.exports.MultiRedis = MultiRedis;
