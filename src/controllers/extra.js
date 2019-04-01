import models from '../models/index'
import { res, notNull } from '../tool/Common'

export let updateTime = async (ctx) => {
  let result = await models.price.priceDB.max('updateAt', {
    where: { status: 0 }
  })
  ctx.body = res(result, 'success')
}

export let wxappFeedback = async (ctx) => {
  await models.feedback.feddbackDB()
  let body = ctx.request.body,
    name = notNull(name, '姓名'),
    email = notNull(email, '邮箱'),
    feedback = notNull(feedback, '意见'),
    userId = ctx.state.userId,
    result
    result = await models.feedback.feddbackDB.create({name, email, feedback, userId})
    ctx.body = res({ id: result.id }, '感谢您的反馈！')
}