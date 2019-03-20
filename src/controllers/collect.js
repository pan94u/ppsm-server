import models from '../models/index'
import {res,notNull} from '../tool/Common'
import validator from 'validator'

export let add = async (ctx) => {
  let body = ctx.request.body
  let model = notNull(body.model, '型号'),
  volume = notNull(body.volume + '', '容量'),
  quality = notNull(body.quality, '成色'),
  targetPrice = notNull(body.targetPrice + '', '价位'),
  phoneNumber = notNull(body.phoneNumber + '', '联系方式'),
  userId = 'ppsm'
  if(!validator.isMobilePhone(phoneNumber,'zh-CN')) {
    throw {
      msg: '号码格式错误！',
      code: -2
    }
    return
  }
  let result = await models.secondHand.shDB.create({userId,model,volume,quality,targetPrice,phoneNumber})
  console.log(JSON.stringify(result))
  ctx.body = res({},'success')
}