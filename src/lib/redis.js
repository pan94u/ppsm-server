import redis from 'redis'
import { redis as redisConfig } from '../config'

export let client = redis.createClient(redisConfig)