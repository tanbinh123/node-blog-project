/**
 * 博客路由
 * @author  Ta_Mu
 * @date 2021/1/13 15:23
 */
const router = require('express').Router();
const ResponseModel = require('../model/response-model')
const BlogService = require('../service/blog-service')
const authenticationFilter = require('../filter/authentication-filter')
const BusinessError = require('../model/business-error')

// 博客列表
router.get('/list',  async (req, res) => {
  const author = req.query.author || ''
  const keyword = req.query.keyword || ''
  const data = await BlogService.getList(author, keyword)
  res.json(ResponseModel.ofSuccess(data))
});

// 博客详情
router.get('/detail',  async (req, res) => {
  blogDataCheck(req.query, ['id'])
  const data = await BlogService.getById(req.query.id)
  res.json(ResponseModel.ofSuccess(data))
});

// 新建博客
router.post('/new', authenticationFilter, async (req, res) => {
  blogDataCheck(req.body, ['title'])
  req.body.author = req.session.user.id
  const data = await BlogService.create(req.body)
  res.json(ResponseModel.ofSuccess(data))
});

// 更新博客
router.post('/update', authenticationFilter, async (req, res) => {
  blogDataCheck(req.body, ['id'])
  await BlogService.update(req.body, req.session.user.id)
  res.json(ResponseModel.ofSuccess())
});

// 删除博客
router.post('/delete', authenticationFilter, async (req, res) => {
  blogDataCheck(req.body, ['id'])
  await BlogService.deleteById(req.body.id, req.session.user.id)
  res.json(ResponseModel.ofSuccess())
});

// 获取当前登录用户博客列表
router.get('/user/list', authenticationFilter,  async (req, res) => {
  const keyword = req.query.keyword || ''
  const data = await BlogService.getList(req.session.user.id, keyword)
  res.json(ResponseModel.ofSuccess(data))
});

const blogDataCheck = (blogData, fields = []) => {
  if(fields.includes('id') && blogData.id == null) {
    throw new BusinessError('博客id为空')
  }
  if(fields.includes('title') && blogData.title == null) {
    throw new BusinessError('博客标题为空')
  }
}

module.exports = router;
