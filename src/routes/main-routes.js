import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter()

router
  .get('/hello', controllers.extra.hello)
  .post('/wxapi/feedback', controllers.extra.wxappFeedback)
  .get('/wxapi/collect', controllers.collect.getAllCollect)
  .post('/wxapi/collect/addRecoveryRecord', controllers.collect.addRecoveryRecord)
  .post('/wxapi/collect/addEnterprisePurchase', controllers.collect.addEnterprisePurchase)
  .post('/wxapi/collect/sh', controllers.collect.secondeHandCollect)
  .post('/wxapi/login', controllers.wxapi.code2Session)
  .post('/wxapi/logout', controllers.wxapi.wxLogout)
  .post('/wxapi/bindPhone', controllers.wxapi.bindPhone)
  .get('/price', controllers.price.Get)
  .get('/price/origin', controllers.price.origin)
  .get('/price/updateTime', controllers.extra.updateTime)
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  }) // 以/public开头则不用经过权限认证
  .all('/upload', controllers.upload.default)
  .post('/auth/:action', controllers.auth.Post)
  // 获取配置api
  .get('/wxapi/config/sh', controllers.config.sh)
  .get('/wxapi/config/recoveryRecord', controllers.config.recoveryRecord)
  // 获取验证码
  .get('/wxapi/captcha', controllers.extra.getCaptcha)
  

module.exports = router
