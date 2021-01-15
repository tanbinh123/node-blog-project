/**
 * 手写简易版express
 * @author  Ta_Mu
 * @date 2021/1/14 15:00
 */
const http = require('http')
const functions = ['use', 'get', 'post']
class MockExpress {

  constructor() {
    this.requests = {}
    this.errorHandler = null
    functions.forEach((func) => {
      this.requests[func] = []
      this[func] = (...rest) => this.register(func, ...rest)
    })
  }
  // 注册函数
  register(type, firstArgs, ...rest) {
    let info = {}
    if(!firstArgs) {
      info =  {}
    }else if(typeof firstArgs === "string") {
      info = {
        path: firstArgs,
        stack: rest
      }
    }else {
      info = {
        path: '/',
        stack: [firstArgs, ...rest]
      }
    }
    this.requests[type].push(info)
  }

  // 过滤出请求栈
  filterRequestStack(method, url) {
    method = method.toLocaleLowerCase()
    const useRequests = this.requests['use']
    const methodRequests = this.requests[method]
    // 合并默认请求和当前请求类型
    const allRequests = useRequests.concat(methodRequests)

    // 过滤出匹配的调用栈
    let callStack = []
    allRequests.forEach(item => {
      if(item && item.path && this.isIncludePath(url, item.path)) {
        callStack = callStack.concat(item.stack)
      }
    })
    return callStack
  }

  isIncludePath(accessUrl = '', targetPath = '') {
    targetPath = targetPath.endsWith('/') ? targetPath : targetPath + '/'
    accessUrl = accessUrl.split("?")[0]
    accessUrl = accessUrl.endsWith('/') ? accessUrl : accessUrl + '/'
    return accessUrl.indexOf(targetPath) === 0
  }

  // 执行调用栈
  exec(callstack, req, res) {
    try {
      const next = () => {
        if(callstack.length === 0) {
          throw new Error('404')
        }
        const func = callstack.shift()
        if(func) {
          func(req, res, next)
        }
      }
      next()
    }catch (e) {
      if(this.errorHandler) {
        this.errorHandler(e)
      }else {
        console.error(e)
      }
      res.json({code: 404})
    }
  }

  onError(handler) {
    this.errorHandler = (error) => handler(error)
  }

  // 服务请求回调
  callback() {
    return (req, res) => {
      // 创建res.json函数，直接返回json
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json')
        res.end(
          JSON.stringify(data)
        )
      }
      const method = req.method
      const url = req.url
      // 获取调用栈
      const callStack = this.filterRequestStack(method, url)
      // 处理调用栈
      this.exec(callStack, req, res)
    }
  }

  listen(...rest) {
    const app = http.createServer(this.callback())
    app.listen(...rest)
  }
}


module.exports = MockExpress