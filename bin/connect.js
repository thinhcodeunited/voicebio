const redis = require('redis');
const {host, port, username, password} = require('./redisConfig');

const dbNumber = 0;
const url = `redis://${username}:${password}@${host}:${port}/${dbNumber}`;
const redisClient = redis.createClient({url});
redisClient.connect();

redisClient.on('connect', function () {
    console.log('Connected to redis client.');
}).on('error', function (error) {
    console.log(error);
});

module.exports = redisClient;