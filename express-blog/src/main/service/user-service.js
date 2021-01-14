/**
 * 用户服务
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */

const BusinessError = require('../model/business-error')
const UserDao = require('../dao/user-dao')
const {passwordMatch} = require('../util/encrypt-util')
/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 */
const login = async (username, password) => {
   const user = await UserDao.getByUsername(username);
   if(!user) {
     throw new BusinessError('用户名或密码错误')
   }
   if(!passwordMatch(password, user.password)) {
     throw new BusinessError('用户名或密码错误')
   }
   return user;
}
/**
 * 通过id获取用户
 * @param id 用户id
 */
const getById = async (id) => {
  return UserDao.getById(id)
}

const UserService = {
  login,
  getById
}
module.exports = UserService

