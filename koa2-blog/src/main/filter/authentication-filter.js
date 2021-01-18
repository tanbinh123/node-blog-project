/**
 * 认证拦截器
 * @author  Ta_Mu
 * @date 2021/1/13 17:38
 */
const BusinessError = require('../model/business-error')
const { USER_NOT_LOGIN } = require('../constants/business-error-constants')

const authenticationFilter = (context, next) => {
  if(context.session.user) {
    return next()
  }
  throw BusinessError.ofStatus(USER_NOT_LOGIN)
}

module.exports = authenticationFilter