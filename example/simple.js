//
// Pass in array of redis objects of the form...
// [
//   {
//     "host": "127.0.0.1",
//     "port": 6379
//   }
// ]
// into this function
//
var multiRedis = require('../')();
var key = 'jcrugzz/test';
//
// Return a redis client based on the consistent hasing of hashring
//
var client = multiRedis.client(key);

//
// Now we have a standard `node_redis` client
//
client.set(key, 'O hai there', function (err) {
  if (err) {
    process.exit(1);
    return console.error(err)
  }
  console.log('SUCCESS');

  client.get(key, function (err, res) {
    if (err) {
      process.exit(1);
      return console.error(err)
    }
    console.log(res);
    process.exit(0);
  });
});
