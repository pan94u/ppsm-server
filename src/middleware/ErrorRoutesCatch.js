module.exports = function () {
  return function (ctx, next) {
    return next().catch((err) => {
      switch (err.status) {
        case 401:
          ctx.status = 401
          ctx.body = {
            code: -1,
            data: null,
            msg: '登录信息失效，请重新登录'
          }
          break
        default:
          throw err
      }
    })
  }
}
