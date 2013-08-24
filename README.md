# multi-redis

A simple wrapper around the [`node_redis`][redis] and [`node-hashring`][hashring]
modules to allow for an easy way to use consistent hashing to distribute to
multiple redises.

## Example
```js
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
```

## API

### Constructor -> `var multiRedis = require('multi-redis')(redises)`

Instantiates a multiRedis instance that sets up the array of redis clients

### `var client = multRedis.client(key)`

Retrieves the correct client based on key given using the consistent hashing of
[`node-hashring`][hashring]

### `multiRedis.end()`

Calls `redis.end()` for all of the underlying redis clients instantiated by the
constructor

## License

MIT

[redis]: https://github.com/mranney/node_redis
[hashring]: https://github.com/3rd-Eden/node-hashring
