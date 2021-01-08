/**
 * 转义博客正文
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */

const toLiteral = (str) => {
  const dict = {'\b': 'b', '\t': 't', '\n': 'n', '\v': 'v', '\f': 'f', '\r': 'r'};
  return str.replace(/([\\'"\b\t\n\v\f\r])/g, function ($0, $1) {
    return '\\' + (dict[$1] || $1);
  })
}

module.exports = {
  toLiteral
}