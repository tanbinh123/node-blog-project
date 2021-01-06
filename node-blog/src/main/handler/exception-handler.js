const BusinessError = require('../model/business-error')
const ResponseModel = require('../model/response-model')
/**
 * 统一异常距离
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const exceptionHandler = (e, req, res) => {
  let message = '服务器异常'
  let code = 500
  if(e instanceof BusinessError) {
    message = e.message
    code = e.code
  }
  res.end(JSON.stringify(ResponseModel.ofStatus(null, message, code)))
}

module.exports = exceptionHandler