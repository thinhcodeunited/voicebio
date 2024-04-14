const redisClient = require('../bin/connect');

const verifyRedis = (key) => {
  return redisClient.EXISTS(key);
}

const getSingleRedis = (key) => {
  return redisClient.GET(key);
}

const removeSingleRedis = (key) => {
  return redisClient.DEL(key);
}

const setSingleRedisForever = (key, value) => {
  return redisClient.SET(key, value);
}

module.exports = { verifyRedis, getSingleRedis, removeSingleRedis, setSingleRedisForever }