/**
 * 博客路由
 * @author  Ta_Mu
 * @date 2021/1/13 15:23
 */
const router = require('koa-router')()
const ResponseModel = require('../model/response-model')
const UserService = require('../service/user-service')
const BusinessError = require('../model/business-error')

router.prefix('/api/user')

router.post('/login',  async (ctx, next) => {
  const {username, password} = ctx.request.body;
  if(!username || !password) {
    throw new BusinessError('用户名或密码为空')
  }
  const data = await UserService.login(username, password)
  ctx.session.user = data
  ctx.body = ResponseModel.ofSuccess(data)
});

module.exports = router