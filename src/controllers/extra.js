import models from '../models/index';
import { notNull, res, checkCap } from '../tool/Common';
import captchapng from 'captchapng2'
import { setItem } from '../lib/redis'

export let updateTime = async (ctx) => {
  let result = await models.price.priceDB.max('updateAt', {
    where: { status: 0 }
  })
  ctx.body = res(result, 'success')
}

export let wxappFeedback = async (ctx) => {
  await models.feedback.feddbackDB.sync()
  let body = ctx.request.body,
    name = body.name,
    email = body.email,
    feedback = notNull(body.feedback, '意见'),
    capId = notNull(body.capId),
    capCode = notNull(body.capCode, '验证码'),
    userId = ctx.state.userId,
    result
    await checkCap(capId, capCode)
    result = await models.feedback.feddbackDB.create({name, email, feedback, userId})
    ctx.body = res({ id: result.id }, '感谢您对胖胖数码的支持！')
}

export let getCaptcha = async (ctx) => {
  let code = parseInt(Math.random() * 9000 + 1000);
  let png = new captchapng(80, 30, code)
  let date = new Date()
  let capKey = '' + date.getTime() + Math.round(Math.random()*10e5)
  setItem(capKey, code, 300)
  let buffer = png.getBuffer()
  let result = {
    id: capKey,
    value: new Buffer(buffer).toString('base64')
  }
  ctx.body = res(result)
}

export let hello = async (ctx) => {
  if(ctx.request.body.key!='ppsm2019') {
    ctx.body = res('out','bad request', 400)
    return
  }
  // 后台用户表
  await models.adminUser.userDB.sync({})
  // 企业采购
  await models.company.default.sync({})
  // 国家列表枚举
  await models.countryList.countryListDB.sync({})
  // 反馈
  await models.feedback.feddbackDB.sync({})
  // pss分组
  await models.group.groupDB.sync({})
  // pss型号
  await models.model.modelDB.sync({})
  // pss价格
  await models.price.priceDB.sync({})
  // 成色列表
  await models.qualityList.qualityListDB.sync({})
  // 回收
  await models.recovery.default.sync({})
  // 二手求购
  await models.secondHand.shDB.sync({})
  // 小程序用户表
  await models.user.userDB.sync({})
  // 成色列表
  await models.volumeList.volumeListDB.sync({})
  ctx.body = res('success')
}