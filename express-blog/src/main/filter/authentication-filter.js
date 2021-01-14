/**
 * 认证拦截器
 * @author  Ta_Mu
 * @date 2021/1/13 17:38
 */
const BusinessError = require('../model/business-error')
const { USER_NOT_LOGIN } = require('../constants/business-error-constants')

const authenticationFilter = (req, res, next) => {
  if(req.session.user) {
    return next()
  }
  throw BusinessError.ofStatus(USER_NOT_LOGIN)
}

module.exports = authenticationFilter