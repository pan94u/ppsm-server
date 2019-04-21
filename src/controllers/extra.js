import models from '../models/index';
import { notNull, res } from '../tool/Common';
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
    userId = ctx.state.userId,
    result
    await checkCap(capId, capCode)
    result = await models.feedback.feddbackDB.create({name, email, feedback, userId})
    ctx.body = res({ id: result.id }, '感谢您对胖胖数码的支持！')
}

export let hello = async (ctx) => {
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