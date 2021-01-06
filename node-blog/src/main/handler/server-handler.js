const querystring = require('querystring')
const userController = require('../controller/user-controller')
const blogController = require('../controller/blog-controller')
const ResponseModel = require('../model/response-model')
const TokenUtil = require('../util/token-util')
// 获取post数据
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if(req.method !== 'POST') {
      resolve({})
      return;
    }
    if(req.headers['content-type'] !== 'application/json') {
      resolve({})
      return;
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk
    })
    req.on('end', () => {
      try {
        const data = JSON.parse(postData)
        resolve(data || {})
      }catch (e) {
        reject('请求参数错误')
      }
    })
  });
}
const parseCookie = (req) => {
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(item) {
      const keyValArr = item.split("=")
      const key = keyValArr[0].trim()
      req.cookie[key] = keyValArr[1].trim()
    }
  })
}

// 解析session
const parseSession = async (req, res) => {
  let token = req.cookie.token
  // 临时记录session数据
  let user = {}
  if(token) {
    const resultUser = await TokenUtil.getUserByToken(token)
    if(!resultUser) {
      // 如果result 不存在， 则移除cookie，避免重复访问redis
      TokenUtil.deleteCookieToken(res)
    }else {
      user = JSON.parse(resultUser)
    }
  }
  req.session = user
}

const serverHandler = async (req, res) => {
  // 设置数据返回格式
  res.setHeader('Content-type', 'application/json')

  // 设置path
  const url = req.url
  req.path = url.split("?")[0];
  req.query = querystring.parse(url.split("?")[1])
  // 处理post数据
  req.body = await getPostData(req);
  // 处理当前用户cookie
  parseCookie(req)
  // 处理当前用户session
  await parseSession(req, res)

  // 处理blog接口
  const blogData = await blogController(req, res)
  if(blogData) {
    res.end(
      JSON.stringify(blogData)
    )
    return
  }
  // 处理user接口
  const userData = await userController(req, res)
  if(userData) {
    res.end(
      JSON.stringify(userData)
    )
    return
  }
  // 404
  res.end(
    JSON.stringify(ResponseModel.ofFailure('请求url不存在'))
  )
}

module.exports = serverHandler;