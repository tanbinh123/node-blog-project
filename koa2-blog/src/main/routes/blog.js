/**
 * 博客路由
 * @author  Ta_Mu
 * @date 2021/1/13 15:23
 */
const router = require('koa-router')()
const ResponseModel = require('../model/response-model')
const BlogService = require('../service/blog-service')
const authenticationFilter = require('../filter/authentication-filter')
const BusinessError = require('../model/business-error')

router.prefix('/api/blog')

// 博客列表
router.get('/list',  async (ctx, next) => {
  const author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  const data = await BlogService.getList(author, keyword)
  ctx.body = ResponseModel.ofSuccess(data)
});

// 博客详情
router.get('/detail',  async (ctx, next) => {
  blogDataCheck(ctx.query, ['id'])
  const data = await BlogService.getById(ctx.query.id)
  ctx.body = ResponseModel.ofSuccess(data)
});

// 新建博客
router.post('/new', authenticationFilter, async (ctx, next) => {
  blogDataCheck(ctx.request.body, ['title'])
  ctx.request.body.author = ctx.session.user.id
  const data = await BlogService.create(ctx.request.body)
  ctx.body = ResponseModel.ofSuccess(data)
});

// 更新博客
router.post('/update', authenticationFilter, async (ctx, next) => {
  blogDataCheck(ctx.request.body, ['id'])
  await BlogService.update(ctx.request.body, ctx.session.user.id)
  ctx.body = ResponseModel.ofSuccess()
});

// 删除博客
router.post('/delete', authenticationFilter, async (ctx, next) => {
  blogDataCheck(ctx.request.body, ['id'])
  await BlogService.deleteById(ctx.request.body.id, ctx.session.user.id)
  ctx.body = ResponseModel.ofSuccess()
});

// 获取当前登录用户博客列表
router.get('/user/list', authenticationFilter,  async (ctx, next) => {
  const keyword = ctx.query.keyword || ''
  const data = await BlogService.getList(ctx.session.user.id, keyword)
  ctx.body = ResponseModel.ofSuccess(data)
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
