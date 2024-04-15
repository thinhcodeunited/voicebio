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

const setSingleRedis = async (key, value, time) => {
  await Promise.all([
    redisClient.SET(key, value),
    redisClient.EXPIRE(key, time),
  ]);
}

module.exports = { verifyRedis, getSingleRedis, removeSingleRedis, setSingleRedisForever, setSingleRedis }