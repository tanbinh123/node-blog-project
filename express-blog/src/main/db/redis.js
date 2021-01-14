/**
 * Redis工具类
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const redis = require('redis')
const {REDIS_CONFIG} = require('../config/db')

// 建立连接
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);


redisClient.on('error', (err) => {
  console.error('redis错误:', err.message)
})

// 获取值
const get = (key) => {
  return new Promise(((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if(err) {
        reject(err)
        return
      }
      resolve(val)
    })
  }))
}
// 设置值
const set = (key, value, expire) => {
  let val = value;
  if(value != null && typeof value === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  if(expire != null) {
    redisClient.expire(key, expire)
  }
}

const del = (key) => {
  redisClient.del(key)
}

const RedisUtil = {
  get,
  set,
  del,
  redisClient
}
module.exports = RedisUtil
