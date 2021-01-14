/**
 * 博客路由
 * @author  Ta_Mu
 * @date 2021/1/13 15:23
 */
const router = require('express').Router();
const ResponseModel = require('../model/response-model')
const UserService = require('../service/user-service')
const BusinessError = require('../model/business-error')

router.post('/login',  async (req, res, next) => {
  const {username, password} = req.body;
  if(!username || !password) {
    throw new BusinessError('用户名或密码为空')
  }
  const data = await UserService.login(username, password)
  req.session.user = data
  res.json(ResponseModel.ofSuccess(data))
});

module.exports = router