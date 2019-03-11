import models from '../models/index'
import {res} from '../tool/Common'

export let updateTime = async (ctx) => {
 let result = await models.price.priceDB.max('updateAt',{
   where:{status:0}
 })
 ctx.body = res(result,'success')
}