import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter()

router
  .post('/price/sh', controllers.collect.add)
  .get('/wxapi/login', controllers.wxapi.code2Session)
  .get('/price', controllers.price.Get)
  .get('/price/updateTime', controllers.extra.updateTime)
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  }) // 以/public开头则不用经过权限认证
  .post('/user/reg', controllers.user.Reg)
  .all('/upload', controllers.upload.default)
  .post('/auth/:action', controllers.auth.Post)

module.exports = router
