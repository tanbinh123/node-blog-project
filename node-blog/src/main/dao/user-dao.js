/**
 * 用户数据库访问层
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const {exec} = require('../db/mysql')
// 通过用户名获取用户
const getByUsername = async (username) => {
  const sql = `select * from user where username = '${username}'`
  const result =  await exec(sql)
  return result && result[0]
}
// 通过id获取用户
const getById = async (id) => {
  const sql = `select * from user where id = ${id}`
  return exec(sql)
}

const UserDao = {
  getByUsername,
  getById
}

module.exports = UserDao