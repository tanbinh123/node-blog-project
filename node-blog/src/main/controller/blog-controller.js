
/**
 * 博客接口
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const ResponseModel = require('../model/response-model')
const BlogService = require('../service/blog-service')
const BusinessError = require('../model/business-error')
const {USER_NOT_LOGIN} = require('../constants/business-error-constants')

const blogController = async (req) => {
  const method = req.method;
  const path = req.path;
  // 拦截博客开头地址
  if(!path.startsWith('/api/blog')) {
    return
  }
   // 博客列表
  if(method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const data = await BlogService.getList(author, keyword)
    return ResponseModel.ofSuccess(data)
  }
  // 获取博客详细
  if(method === 'GET' && path === '/api/blog/detail') {
    const data = await BlogService.getById(req.query.id)
    return ResponseModel.ofSuccess(data)
  }
  // 需要登录才可以执行后续操作
  if(!req.session.id) {
    throw BusinessError.ofStatus(USER_NOT_LOGIN)
  }
  // 新建博客
  if(method === 'POST' && path === '/api/blog/new') {
    const blogData = req.body
    blogDataChecker(blogData)
    blogData.author = req.session.id
    const data = await BlogService.create(blogData)
    return ResponseModel.ofSuccess(data)
  }
  // 更新博客
  if(method === 'POST' && path === '/api/blog/update') {
    const blogData = req.body
    if(!blogData.id) {
      throw new BusinessError('博客id为空')
    }
    blogDataChecker(req.body)
    await BlogService.update(blogData, req.session.id)
    return ResponseModel.ofSuccess()
  }
  // 删除博客
  if(method === 'POST' && path === '/api/blog/delete') {
    if(!req.body.id) {
      throw new BusinessError('博客id为空')
    }
    await BlogService.deleteById(req.body.id, req.session.id)
    return ResponseModel.ofSuccess()
  }
  // 获取当前登录用户博客列表
  if(method === 'GET' && path === '/api/blog/user/list') {
    const keyword = req.query.keyword || ''
    const data = await BlogService.getList(req.session.id, keyword)
    return ResponseModel.ofSuccess(data)
  }
}

// 校验博客数据
const blogDataChecker = (blogData) => {
  if(!blogData.title) {
    throw new BusinessError('标题为空')
  }
}

module.exports = blogController;
