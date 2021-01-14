/**
 * 博客数据库访问层
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const {exec, escape} = require('../db/mysql')
const dayjs = require('dayjs')
const CommonUtil = require('../util/common-util')
const xss = require('xss')

const getList = (author, keyword) => {
  let sql = 'select * from blog where 1 = 1'
  if(author) {
    sql += ` and author = ${escape(author)}`
  }
  if(keyword) {
    sql += ` and title like '%${escape(keyword)}%'`
  }
  return exec(sql)
}

const getById = async (id) => {
  const sql = `select * from blog where id = ${escape(id)}`
  const result = await exec(sql)
  return result && result[0]
}

const create = async (blogData) => {
  const currentTime = getCurrentTime()
  const sql = `insert into blog (title, content, author, createTime, updateTime) values (
  ${escape(xss(CommonUtil.toLiteral(blogData.title)))}, 
  ${escape(xss(CommonUtil.toLiteral(blogData.content)))}, 
  ${escape(blogData.author)},${escape(currentTime)},
  ${escape(currentTime)}
   )`
  const result = await exec(sql)
  return {
    id: result.insertId,
    title: blogData.title,
    content: blogData.content,
    author: blogData.author,
    createTime: currentTime,
    updateTime: currentTime
  }
}

const update = async (blogData) => {
  const sql = `update blog set 
  title = ${escape(xss(CommonUtil.toLiteral(blogData.title)))}, 
  content = ${escape(xss(CommonUtil.toLiteral(blogData.content)))}
  where id = ${escape(blogData.id)}`
  return exec(sql)
}

const deleteById = async (id) => {
  const sql = `delete from blog where id = ${escape(id)}`
  return exec(sql)
}

const getCurrentTime = () => {
  return dayjs().format('YYYY-MM-DD hh:mm:ss')
}

const BlogDao = {
  getList,
  getById,
  create,
  update,
  deleteById
}
module.exports = BlogDao