var test = require('tape');

var multiRedis = require('../')();
var key = 'jcrugzz/test';

test('Confirm we can successfully store and retrieve values from redis', function (t) {
  t.plan(2);

  function fail (err) {
    t.fail(err);
    cleanup()
  }

  function cleanup() {
    multiRedis.end()
    t.end();
  }

  var client = multiRedis.client(key);

  client.set(key, 'O hai there', function (err) {
    if (err) { return fail(err) }
    t.pass('Set was successful');

    client.get(key, function (err, res) {
      if (err) { return fail(err) }
      t.ok(res, 'Get was successful');
      cleanup();
    });
  });
});
