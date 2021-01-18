/**
 * 博客服务
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const BlogDao = require('../dao/blog-dao')
const BusinessError = require('../model/business-error')
/**
 * 获取博客列表
 * @param author 作者id
 * @param keyword 查询关键字
 */
const getList = (author, keyword) => {
  return BlogDao.getList(author, keyword);
}
/**
 *  获取博客详情
 * @param blogId 博客id
 */
const getById = async (blogId = '') => {
  const blog = await BlogDao.getById(blogId)
  if(!blog) {
    throw new BusinessError('博客不存在')
  }
  return blog
}

/**
 * 创建博客
 * @param blogData
 */
const create = async (blogData = {}) => {
  return await BlogDao.create(blogData);
}

/**
 * 更新博客
 * @param blogData 博客数据
 */
const update = async (blogData = {}, userId) => {
  await operateChecker(blogData.id, userId)
  await BlogDao.update(blogData)
}

/**
 * 删除博客
 */
const deleteById = async (id, userId) => {
  await operateChecker(id, userId)
  const result = await BlogDao.deleteById(id);
  if(result.affectedRows === 0) {
    throw new BusinessError('删除失败,博客id不存在')
  }
}
// 权限校验
const operateChecker =  async (id, userId) => {
  const blog = await BlogDao.getById(id);
  if(!blog) {
    throw new BusinessError('博客不存在')
  }
  if(blog.author !== userId) {
    throw new BusinessError('无权操作')
  }
}

const BlogService = {
  getList,
  getById,
  create,
  update,
  deleteById
}

module.exports = BlogService
