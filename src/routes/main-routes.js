import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter()

router
  .post('/wxapi/collect/addRecoveryRecord', controllers.collect.addRecoveryRecord)
  .post('/wxapi/collect/addEnterprisePurchase', controllers.collect.addEnterprisePurchase)
  .post('/wxapi/collect/sh', controllers.collect.secondeHandCollect)
  .post('/wxapi/login', controllers.wxapi.code2Session)
  .get('/price', controllers.price.Get)
  .get('/price/updateTime', controllers.extra.updateTime)
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  }) // 以/public开头则不用经过权限认证
  .post('/user/reg', controllers.user.Reg)
  .all('/upload', controllers.upload.default)
  .post('/auth/:action', controllers.auth.Post)

module.exports = router
