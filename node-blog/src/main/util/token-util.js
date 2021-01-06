/**
 * token工具类
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const RedisUtil = require('../db/redis')

const TOKEN_PREFIX = 'TOKEN:'

// 生成token,并设置cookie
const generateToken = (res, user) => {
  const token = Date.now() + '_' + Math.random()
  const expireSeconds = 60 * 60 * 24 // 一天过期
  RedisUtil.set(TOKEN_PREFIX + token, user, expireSeconds)
  const date = new Date()
  date.setTime(date.getTime() + 1000 * expireSeconds)
  res.setHeader('Set-Cookie', `token=${token};path=/;httpOnly;expires=${date.toUTCString()}`) // Sat, 29 Aug 2020 12:06:33 GMT
}

// 删除cookie
const deleteCookieToken = (res) => {
  res.setHeader('Set-Cookie', `token=;path=/;httpOnly;expires=Thu, 01 Jan 1970 00:00:01 GMT;`)
}
// 获取token
const getUserByToken = (token) => {
  return RedisUtil.get(TOKEN_PREFIX + token)
}
// 删除token
const deleteToken = (token) => {
  return RedisUtil.d(TOKEN_PREFIX + token)
}

module.exports = {
  generateToken,
  deleteCookieToken,
  getUserByToken,
  deleteToken
}