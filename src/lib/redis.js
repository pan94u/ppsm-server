import redis from 'redis'
import { redis as redisConfig } from '../config'
const client = redis.createClient(redisConfig)
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

export let setItem = (key, value, exprires) => {
  client.set(key, value);
  //设置过期
  if (exprires) {
    client.expire(key, exprires);
  }
}

export let getItem = async (key) => {
  return await getAsync(key)
}