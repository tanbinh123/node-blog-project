/**
 * 用户接口
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const ResponseModel = require('../model/response-model')
const { login } = require('../service/user-service')
const TokenUtil = require('../util/token-util')
const BusinessError = require('../model/business-error')

const userController = async (req, res) => {
  const method = req.method;
  const path = req.path;
  // 拦截用户开头地址
  if(!path.startsWith('/api/user')) {
    return
  }
  // 登录
  if(method === 'POST' && path === '/api/user/login') {
    const {username, password} = req.body;
    // const {username, password} = req.query;
    if(!username || !password) {
      throw new BusinessError('用户名或密码为空')
    }
    return login(username, password).then(data => {
      TokenUtil.generateToken(res, data)
      return ResponseModel.ofSuccess(data)
    });
  }

  // 登录测试
  if(method === 'GET' && path === '/api/user/login-test') {
    // const {username, password} = req.body;
    const username = req.session.username;
    if(!username) {
      return Promise.resolve(ResponseModel.ofFailure('未登录'))
    }
    return Promise.resolve(ResponseModel.ofSuccess(req.session))
  }
}
module.exports = userController;